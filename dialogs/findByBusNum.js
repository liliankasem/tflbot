module.exports = function () {
    bot.dialog('/findByBusNum', [

        (session, args) => {
            session.userData.busnum = '';
            if(args.entities != null){
                var busnum  = builder.EntityRecognizer.findEntity(args.entities, 'busnum');
                session.userData.busnum = busnum.entity;
            }else{
                session.beginDialog('/getBusNum'); 
            }
            builder.Prompts.text(session, "Please send me your current location. If you can't send location data, type: pass",
            {
                retryPrompt: 'The value entered is not valid, please try again.',
                maxRetries: 2
            });
        },
        
        (session, results) => {
            if(results.response == "pass" || results.response == "Pass"){
                session.beginDialog('/noLocation');
            }else if(session.message.entities.length > 0){
                if(session.message.entities[0].geo != null){
                    session.userData.lat = session.message.entities[0].geo.latitude;
                    session.userData.lon = session.message.entities[0].geo.longitude;

                    tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})
                    .then(result => {     
                        var searchResult = JSON.parse(result.text);   
                        var stopPointsNum = searchResult.stopPoints.length;
                        var direction = new Array();
                        var i = 0;
                        var j = 0;
                        var counter = 0;
                        
                        for(i; i<stopPointsNum; i++){
                            for(j; j<searchResult.stopPoints[i].lines.length; j++){
                                if(searchResult.stopPoints[i].lines[j].name == session.userData.busnum){
                                    direction[counter] = searchResult.stopPoints[i].additionalProperties[1].value;
                                    counter++;
                                }
                            }
                            j=0;         
                        }

                        session.userData.directionArray = direction;
                        session.beginDialog('/selectDirection');
                    })
                    .catch(error => {
                        session.send("findByBusNum: computer says no (can't find stoppoint by location)");
                        session.send(error);
                        session.endConversation();
                    });      
                }else{
                    session.replaceDialog('/noLocationDataPass');
                }          
            }else{
                session.replaceDialog('/noLocationDataPass');
            }
        },

        (session) => {
            tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})       
            .then(result => { 
                var naptanId;
                var busDestination;
                var searchResult = JSON.parse(result.text);
                var userDirection = session.userData.direction;
                session.userData.towards = session.userData.direction;
                var stopPointsNum = searchResult.stopPoints.length;
                
                for(var i=0; i<stopPointsNum; i++){
                    if(searchResult.stopPoints[i].lines.length != 0){
                        busDestination = searchResult.stopPoints[i].additionalProperties[1].value;
                        if(busDestination.includes(userDirection)){
                            session.userData.busstop = searchResult.stopPoints[i].commonName;
                            naptanId = searchResult.stopPoints[i].id;
                            break;
                        }                
                    }           
                }
                return tfl.stoppoint.byIdArrivals(naptanId);
            })
            .catch(error => {
                session.send("findByBusNum: computer says no (can't find stoppoint data)");
                session.send(error);
                session.endConversation();
            })
            .then(result => {
                session.replaceDialog('/displayResults', { result });
            })
            .catch(error => {
                session.send("findByBusNum: computer says no (can't find arrivals Id)");
                session.send(error);
                session.endConversation();
            });
        }
    ]);
}

