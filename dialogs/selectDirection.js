module.exports = function () {
    bot.dialog('/selectDirection', [
        (session) =>{
            builder.Prompts.choice(session, "Which direction is your bus heading in?", session.userData.directionArray,
            {
                listStyle: builder.ListStyle.button,
                retryPrompt: 'The value entered is not valid, please try again.',
                maxRetries: 2
            });
        },
        (session, results) => {
            session.userData.direction = results.response.entity;
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

