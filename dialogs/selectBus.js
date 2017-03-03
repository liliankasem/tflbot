module.exports = function () {
    bot.dialog('/selectBus', [
        (session) => {
            builder.Prompts.choice(session, "What is the bus number?", session.userData.busArray);
        },
        (session, results) => {
            session.userData.busnum = results.response.entity;
            session.endDialog();
        } 
    ]);
}

