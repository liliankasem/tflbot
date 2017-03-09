module.exports = function () {
    bot.dialog('/findByClosestBusStop', [

        (session) => {
            builder.Prompts.text(session, "Send me your current location, if you can't type: pass");
        },

        (session, results, next) => {
            if(results.response == "pass" || results.response == "Pass"){
                session.beginDialog('/noLocation');
            }else if(session.message.entities[0].geo != null){
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
                    var searchResult = JSON.parse(result.text);
                    if(searchResult.length != 0){
                        var i = searchResult.length-1;
                        for(i; i>=0; i--){
                            var lineName = searchResult[i].lineName;
                            var destinationName = searchResult[i].destinationName;   
                            var arrivalTime = searchResult[i].expectedArrival;
                            var time = new Date(arrivalTime);    
                            var timeNow = new Date();
                            var differenceInMinutes = time - timeNow;
                            var estimatedArrivalMinutes = Math.round(differenceInMinutes / 60000);
                            session.send("{0}:{1}   [{2}mins]".format(time.getHours(), time.getMinutes(), estimatedArrivalMinutes));  
                            console.log("{0}:{1}   -----   {2} to {3}".format(time.getHours(), time.getMinutes(), lineName, destinationName));                   
                        } 
                    }else{
                        session.endConversation("There are no near by bus stops");
                    }

                    session.endConversation();
                })
                .catch(error => {
                    session.send("findByClosestBusStop: computer says no (can't find arrivals Id)");
                    session.send(error);
                    session.endConversation();
                });  
            }else{
                session.replaceDialog('/findByClosestBusStop');
            }
        }
    ]);
}

