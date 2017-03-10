module.exports = function () {
    bot.dialog('/checkArrivals', [
        (session) => {
            var busnum = session.userData.busnum;
            var busstop = session.userData.busstop;
            var towards = session.userData.towards;  

            tfl.stoppoint.search(busstop)
            .then(result => {     
                var searchResult = JSON.parse(result.text);   
                var stopId = searchResult.matches[0].id;
                return tfl.stoppoint.byId(stopId);
            })
            .catch(error => {
                session.send("checkArrivals: computer says no (can't find busstop)");
                session.send(error);
                session.endConversation();
            })
            .then(result => { 
                var naptanId;
                var searchResult = JSON.parse(result.text);
                for(var i=0; i<searchResult.children.length; i++){
                    var busdestination = searchResult.children[i].additionalProperties[1].value.toLowerCase();
                    if(busdestination.includes(towards.toLowerCase())){
                        naptanId = searchResult.children[i].id;
                    }
                }   
                return tfl.stoppoint.byIdArrivals(naptanId);
            })
            .catch(error => {
                session.send("checkArrivals: computer says no (can't find stop Id)");
                session.send(error);
                session.endConversation();
            })           
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
                session.send("checkArrivals: computer says no (can't find arrivals Id)");
                session.send(error);
                session.endConversation();
            });
        }
    ]);
}

