module.exports = function () {
    bot.dialog('/getBusNum', [
        (session) => {
            builder.Prompts.text(session, "What is the number of the bus you looking for?");
        },
        (session, results) => {
            session.userData.busnum = results.response;
            session.endDialog();
        } 
    ]);
}

