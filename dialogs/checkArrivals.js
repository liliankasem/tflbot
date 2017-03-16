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
                session.send("Sorry! I can't find this bus stop.");
                session.replaceDialog('/transportMode');
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
                session.send("Sorry! I can't find this bus stop.");
                session.replaceDialog('/transportMode');
            })           
            .then(result => { 
                session.replaceDialog('/displayResults', { result });
            })
            .catch(error => {
                session.send("Sorry! I can't find this bus stop.");
                session.replaceDialog('/transportMode');
            });
        }
    ]);
}

