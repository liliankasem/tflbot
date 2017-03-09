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
                var searchResult = JSON.parse(result.text);
                var i = searchResult.length-1;
                session.send(busnum + " expected arrival times:");
                for(i; i>=0; i--){
                    if(searchResult[i].lineName == busnum){
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
                }

                session.endConversation();
            })
            .catch(error => {
                session.send("checkArrivals: computer says no (can't find arrivals Id)");
                session.send(error);
                session.endConversation();
            });
        }
    ]);
}

