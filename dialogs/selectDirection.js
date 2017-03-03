module.exports = function () {
    bot.dialog('/selectDirection', [
        (session) =>{
            builder.Prompts.choice(session, "Which direction is your bus heading in?", session.userData.directionArray);
        },
        (session, results) => {
            session.userData.direction = results.response.entity;
            session.endDialog();
        } 
    ]);
}

