module.exports = function () {
    bot.dialog('/selectLine', [
        (session) =>{
            builder.Prompts.choice(session, "Which tube line are you interested in?", session.userData.linesArray,
            {
                listStyle: builder.ListStyle.button,
                retryPrompt: 'The value entered is not valid, please try again.',
                maxRetries: 2
            });
        },
        (session, results) => {
            session.userData.line = results.response.entity;
            session.endDialog();
        } 
    ])
    .cancelAction('Cancel', 'Operation cancelled', {
        matches: /^cancel$/,
        onSelectAction: (session, args) => {
            session.endConversation(`Operation cancelled.`);
        },
        confirmPrompt: `Are you sure you wish to cancel?`
    });
}

