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
            builder.Prompts.text(session, "Please send me your current location. If you can't send location data, type: pass");
        },
        
        (session, results, next) => {
            if(results.response == "pass" || results.response == "Pass"){
                session.beginDialog('/noLocation');
            }else if(session.message.entities[0].geo != null){
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
                next;         
            }else{
                session.replaceDialog('/findByBusNum');
            }
        },

        (session, next) => {
            var busnum = session.userData.busnum;
            var busstop = session.userData.busstop;
            var towards = session.userData.towards; 

            tfl.stoppoint({ lat: session.userData.lat, lon: session.userData.lon, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})       
            .then(result => { 
                var naptanId;
                var busDestination;
                var searchResult = JSON.parse(result.text);
                var userDirection = session.userData.direction;
                var stopPointsNum = searchResult.stopPoints.length;
                
                for(var i=0; i<stopPointsNum; i++){
                    if(searchResult.stopPoints[i].lines.length != 0){
                        busDestination = searchResult.stopPoints[i].additionalProperties[1].value;
                        if(busDestination.includes(userDirection)){
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
                var times = [];
                var searchResult = JSON.parse(result.text);

                if(searchResult.length != 0){              
                    session.send("Here are the expected arrival times for the {0} from {1} to {2}:".format(busnum, busstop, towards));
                    for(var i=0; i<searchResult.length; i++){
                        if(searchResult[i].lineName == busnum){
                            times[i] = new Date(searchResult[i].expectedArrival);
                        }
                    }

                    times.sort();

                    for(var time in times){
                        var timeNow = new Date();
                        var differenceInMinutes = times[time] - timeNow;
                        var estimatedArrivalMinutes = Math.round(differenceInMinutes / 60000);
                        session.send("{0}:{1}   [{2}mins]".format(times[time].getHours(), times[time].getMinutes(), estimatedArrivalMinutes));  
                        console.log("{0}:{1}   -----   {2} to {3}".format(times[time].getHours(), times[time].getMinutes(), busnum, towards)); 
                    }

                    session.endConversation();
                }else{
                    session.endConversation("Sorry, I couldn't find anything :(");
                }

            })
            .catch(error => {
                session.send("findByBusNum: computer says no (can't find arrivals Id)");
                session.send(error);
                session.endConversation();
            });
        }
    ]);
}

