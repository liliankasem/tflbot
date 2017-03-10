module.exports = function () {
    bot.dialog('/getBusStop', [
        (session) => {
            builder.Prompts.text(session, "Got it, and at which bus stop are you waiting for the {0}?".format(session.userData.busnum));
        },
        (session, results) => {
            session.userData.busstop = results.response;     
            session.endDialog();
        } 
    ]);
}

