module.exports = function () {
    bot.dialog('/displayResultsTube',
        (session, args, next) => {
            if (args.result) {
                var times = [];
                var line = session.userData.line;
                var currentStation = session.userData.currentUndergroundStation;
                var searchResult = JSON.parse(args.result.text);
                var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);

                for(var i=0; i<searchResult.length; i++){
                    if(searchResult[i].lineId == line){
                        times[i] = new Date(searchResult[i].expectedArrival);
                    }
                }

                if(times.length == 0){
                    session.send("Either there isn't a {0} line service at {1} station, or there are currently no train times available".format(line, currentStation));
                    session.replaceDialog('/mainMenu');
                }else{
                    session.send("Here are the expected arrival times for the {0} service at {1} station:".format(line, currentStation));
                    times.sort();                            

                    for(var time in times){
                        var timeNow = new Date();
                        var differenceInMinutes = times[time] - timeNow;
                        var estimatedArrivalMinutes = Math.round(differenceInMinutes / 60000);
                        msg.addAttachment(new builder.HeroCard(session)
                            .title("To " + searchResult[time].destinationName)                   
                            .text("{0}:{1} \n [{2}mins]".format( times[time].getHours(), times[time].getMinutes(), estimatedArrivalMinutes))
                        );
                        console.log("{0}:{1}   -----   {2} to {3}".format(times[time].getHours(), times[time].getMinutes(), searchResult[time].lineNam, searchResult[time].destinationName)); 
                    }

                    session.send(msg);
                    session.replaceDialog('/mainMenu');
                }
            }else{
                session.endConversation("Sorry, I couldn't find anything :(");
            }
        }
    );
}



