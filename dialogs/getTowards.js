module.exports = function () {
    bot.dialog('/getTowards', [
        (session) => {
            builder.Prompts.text(session, "Great. So you want to get information for the {0} at bus stop {1}. In which directon is your bus heading towards?".format(session.userData.busnum, session.userData.busstop));
        },
        (session, results) => {
            session.userData.towards = results.response;           
            session.endDialog();
        } 
    ]);
}

