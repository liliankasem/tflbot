module.exports = function () {
    bot.dialog('/getBusNum', [
        (session) => {
            builder.Prompts.text(session, "What is the number of the bus you are waiting for?", 
            {
                retryPrompt: 'The value entered is not a bus number, please try again.',
                maxRetries: 2
            });
        },
        (session, results) => {
            session.userData.busnum = results.response;
            session.endDialog();
        } 
    ]);
}

