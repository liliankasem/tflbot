module.exports = function () {
    bot.dialog('/tubeStatus',
        (session, args, next) => {
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            tfl.line.modeDisruption("tube")
                .then(result => {     
                    var searchResult = JSON.parse(result.text);   

                    if(searchResult.length == 0){
                        session.send("There is a good service on all lines.");
                        session.replaceDialog('/mainMenu');
                    }else{
                        for(var i in searchResult){
                            msg.addAttachment(new builder.HeroCard(session)
                                .title(searchResult[i].description.substr(0, searchResult[i].description.indexOf(':')))                   
                                .text(searchResult[i].description)
                            );
                        }
                        session.send(msg);
                        session.send("There is a good service on all other lines.");
                        session.replaceDialog('/mainMenu');
                    }
                })
                .catch(error => {
                    session.send("Sorry! I can't find this tube station.");
                    session.replaceDialog('/transportMode');
                }) 
        }
    );
}