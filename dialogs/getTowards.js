module.exports = function () {
    bot.dialog('/getTowards', [
        (session) => {
            builder.Prompts.text(session, "In which directon is your bus heading towards?");
        },
        (session, results) => {
            session.userData.towards = results.response;           
            session.endDialog();
        } 
    ]);
}

