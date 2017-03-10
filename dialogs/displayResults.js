module.exports = function () {
    bot.dialog('/displayResults',
        (session, args, next) => {
            if (args.result) {
                var busnum = session.userData.busnum;
                var busstop = session.userData.busstop;
                var towards = session.userData.towards;  
                var times = [];
                var searchResult = JSON.parse(args.result.text);
                var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);

                for(var i=0; i<searchResult.length; i++){
                    if(searchResult[i].lineName == busnum){
                        times[i] = new Date(searchResult[i].expectedArrival);
                        towards = searchResult[i].towards;
                    }
                }

                if(times.length == 0){
                    session.endConversation("There isn't a {0} bus at {1} busstop".format(busnum, busstop));
                }else{
                    session.send("Here are the expected arrival times for the {0} from {1} to {2}:".format(busnum, busstop, towards));
                    times.sort();
                    for(var time in times){
                        var timeNow = new Date();
                        var differenceInMinutes = times[time] - timeNow;
                        var estimatedArrivalMinutes = Math.round(differenceInMinutes / 60000);
                        msg.addAttachment(new builder.HeroCard(session)
                            .title("{0} to {1}".format(busnum, towards))                  
                            .text("{0}:{1} - [{2}mins]".format( times[time].getHours(), times[time].getMinutes(), estimatedArrivalMinutes))
                        );
                        console.log("{0}:{1}   -----   {2} to {3}".format(times[time].getHours(), times[time].getMinutes(), busnum, towards)); 
                    }
                    session.send(msg);
                    session.endConversation("Next time, why don't you try a query like this one for a faster result: \n 'When is the next {0} from {1} to {2}'".format(busnum, busstop, towards));
                }
            } else {
                session.endConversation("Sorry, I couldn't find anything :(");
            }
        }
    );
}

