module.exports = function () {
    bot.dialog('/findByClosestBusStop', [

        (session) => {
            builder.Prompts.text(session, "Please send me your current location. If you can't send location data, type: pass");
        },

        (session, results, next) => {
            if(results.response == "pass" || results.response == "Pass"){
                session.userData.busnum = '';
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
                    var busnum = session.userData.busnum;
                    var busstop = session.userData.busstop;
                    var towards = session.userData.towards;  
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
                        session.endConversation("There are no near by bus stops");
                    }
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

