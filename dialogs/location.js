module.exports = function () {
    bot.dialog('/location', [
        (session, next) => {
            builder.Prompts.text(session, "Please send me your current location. If you can't send location data, type: pass");
        },

        (session, results, next) => {
            if(results.response == "pass" || results.response == "Pass"){
                session.userData.busnum = '';
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
                        var counter=0;
                        for(var i=0; i<stopPointsNum; i++){
                            if(searchResult.stopPoints[i].lines.length != 0){
                                direction[counter] = searchResult.stopPoints[i].additionalProperties[1].value;
                                counter++;
                            }           
                        }

                        session.userData.directionArray = direction;
                        session.beginDialog('/selectDirection');
                    })
                    .catch(error => {
                        session.send("location: computer says no (can't find stoppoint data)");
                        session.send(error);
                        session.endConversation();
                    });;
                    //next();
                }else{
                    session.replaceDialog('noLocationDataPass');
                }
            }else{
                session.replaceDialog('/noLocationDataPass');
            }
        },

        (session, next) => {
            var latitude =  session.userData.lat;
            var longitude =  session.userData.lon;

            tfl.stoppoint({ lat: latitude, lon: longitude, stopTypes: 'NaptanBusWayPoint,NaptanBusCoachStation,NaptanPublicBusCoachTram'})       
            .then(result => { 
                var naptanId;
                var searchResult = JSON.parse(result.text);
                var userDirection = session.userData.direction;
                var stopPointsNum = searchResult.stopPoints.length;
                var busDestination;
                var busNumbers = new Array();
                
                for(var i=0; i<stopPointsNum; i++){
                    if(searchResult.stopPoints[i].lines.length != 0){
                        busDestination = searchResult.stopPoints[i].additionalProperties[1].value;
                        if(busDestination.includes(userDirection)){
                            session.userData.naptanId = searchResult.stopPoints[i].id;
                            
                            for(var j=0; j<searchResult.stopPoints[i].lines.length; j++){
                                busNumbers[j] = searchResult.stopPoints[i].lines[j].name;
                            }

                            session.userData.busArray = busNumbers;
                            session.beginDialog('/selectBus');

                            break;
                        }                
                    }           
                }
            })
            .catch(error => {
                session.send("location: computer says no (can't find stoppoint data)");
                session.send(error);
                session.endConversation();
            });
            next;
        },

        (session) => {
            var naptanId = session.userData.naptanId;
            var busnum = session.userData.busnum;
            var busnum = session.userData.busnum;
            var busstop = session.userData.busstop;
            var towards = session.userData.towards; 

            tfl.stoppoint.byIdArrivals(naptanId)
            .then(result => { 
                session.replaceDialog('/displayResults', { result }); 
                // var times = [];
                // var searchResult = JSON.parse(result.text);

                // if(searchResult.length != 0){              
                //     session.send("Here are the expected arrival times for the {0} from {1} to {2}:".format(busnum, busstop, towards));
                //     for(var i=0; i<searchResult.length; i++){
                //         if(searchResult[i].lineName == busnum){
                //             times[i] = new Date(searchResult[i].expectedArrival);
                //         }
                //     }

                //     times.sort();

                //     for(var time in times){
                //         var timeNow = new Date();
                //         var differenceInMinutes = times[time] - timeNow;
                //         var estimatedArrivalMinutes = Math.round(differenceInMinutes / 60000);
                //         session.send("{0}:{1}   [{2}mins]".format(times[time].getHours(), times[time].getMinutes(), estimatedArrivalMinutes));  
                //         console.log("{0}:{1}   -----   {2} to {3}".format(times[time].getHours(), times[time].getMinutes(), busnum, towards)); 
                //     }

                //     session.endConversation(); 
                // }else{
                //     session.endConversation("Sorry, I couldn't find anything :(");
                // }
            })
            .catch(error => {
                session.send("location: computer says no (can't find ArrivalsId)");
                session.send(error);
                session.endConversation();
            });
        }
    ]);
}

