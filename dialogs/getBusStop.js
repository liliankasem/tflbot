module.exports = function () {
    bot.dialog('/getBusStop', [
        (session) => {
            builder.Prompts.text(session, "What is the name of the bus stop that you are currently standing at?");
        },
        (session, results) => {
            session.userData.busstop = results.response;     
            session.endDialog();
        } 
    ]);
}

