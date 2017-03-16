module.exports = function () {
    bot.dialog('/tubeArrivals', [
        (session) => {
            var promptMsg = "What is the name of the underground station you will be travelling from?";
            builder.Prompts.text(session, promptMsg);
        },

        (session, results, next) => {
            if (results.response) {               
                session.userData.currentUndergroundStation = results.response;
                next();
            }
        },

        (session, args, next) => {
            var currentStation = session.userData.currentUndergroundStation;
            tfl.stoppoint.search(currentStation + "?modes=tube")
                .then(result => {     
                    var searchResult = JSON.parse(result.text);   
                    var stopId = searchResult.matches[0].id;
                    return tfl.stoppoint.byId(stopId);
                })
                .catch(error => {
                    session.send("Sorry! I can't find this tube station.");
                    session.replaceDialog('/transportMode');
                })
                .then(result => { 
                    var line;
                    var lines = new Array();
                    var searchResult = JSON.parse(result.text);
                    session.userData.naptanId = searchResult.naptanId; 
                    if(searchResult.lineModeGroups.length > 0){
                        for(var j = 0; j <searchResult.lineModeGroups.length; j++){
                            if(searchResult.lineModeGroups[j].modeName == "tube"){
                                var len = searchResult.lineModeGroups[j].lineIdentifier.length;
                                if(len > 1){
                                    for(var i=0; i<len; i++){
                                        lines[i] = searchResult.lineModeGroups[j].lineIdentifier[i];
                                    }
                                    session.userData.linesArray = lines;
                                    session.beginDialog('/selectLine');
                                }else{
                                    session.userData.line = searchResult.lineModeGroups[j].lineIdentifier[0];
                                    next();
                                }
                            }
                        }
                    }                             
                })
                .catch(error => {
                    session.send("Sorry! I can't find this tube station.");
                    session.replaceDialog('/transportMode');
                })  

        },

        (session) => {
            var naptanId = session.userData.naptanId;
            tfl.stoppoint.byIdArrivals(naptanId)
                .then(result => { 
                    session.replaceDialog('/displayResultsTube', { result });
                })
                .catch(error => {
                    session.send("Sorry! I can't find this tube station.");
                    session.replaceDialog('/transportMode');
                });
        }         

    ]);
}