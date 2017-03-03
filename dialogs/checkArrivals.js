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
                session.endDialog();
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
                session.endDialog();
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
                        session.send(time.getHours()+1 + ":" + time.getMinutes());   
                        console.log(time.getHours()+1 + ":" + time.getMinutes() + "     " + lineName + " to " + destinationName);        
                    }
                } 
            })
            .catch(error => {
                session.send("checkArrivals: computer says no (can't find arrivals Id)");
                session.send(error);
                session.endDialog();
            });
        }
    ]);
}

