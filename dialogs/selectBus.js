module.exports = function () {
    bot.dialog('/selectBus', [
        (session) => {
            builder.Prompts.choice(session, "What is the bus number?", session.userData.busArray,
            {
                retryPrompt: 'The value entered is not valid, please try again.',
                maxRetries: 2
            });
        },
        (session, results) => {
            session.userData.busnum = results.response.entity;
            session.endDialog();
        } 
    ]);
}

