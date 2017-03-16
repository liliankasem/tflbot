module.exports = function () {
    bot.dialog('/findByClosestBusStop', [

        (session) => {
            builder.Prompts.text(session, "Please send me your current location. If you can't send location data, type: pass",    
            {
                retryPrompt: 'The value entered is not valid, please try again.',
                maxRetries: 2
            });
        },

        (session, results, next) => {
            if(results.response == "pass" || results.response == "Pass"){
                session.userData.busnum = '';
                session.beginDialog('/noLocation');
            }else if(session.message.entities.length > 0){
                if(session.message.entities[0].geo != null){
                    session.userData.lat = session.message.entities[0].geo.latitude;
                    session.userData.lon = session.message.entities[0].geo.longitude;

                    tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram', radius: 500})
                    .then(result => {     
                        var searchResult = JSON.parse(result.text);   
                        var naptanId = searchResult.stopPoints[0].id;

                        return tfl.stoppoint.byIdArrivals(naptanId);
                    })
                    .catch(error => {
                        session.send("findByClosestBusStop: computer says no (can't find stoppoint)");
                        session.send(error);
                        session.endConversation();
                    })
                    .then(result => { 
                        session.replaceDialog('/displayResultsAll', { result });
                    })
                    .catch(error => {
                        session.send("findByClosestBusStop: computer says no (can't find arrivals Id)");
                        session.send(error);
                        session.endConversation();
                    }); 
                }else{
                    session.replaceDialog('/noLocationDataPass');
                }            
            }else{
                session.replaceDialog('/noLocationDataPass');
            }
        }
    ]);
}

