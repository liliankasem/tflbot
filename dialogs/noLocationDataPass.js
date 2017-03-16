module.exports = function () {
    bot.dialog('/noLocationDataPass',
        (session) => {
            session.send("Hey, looks like you didn't send any location data (or type pass), I'm going to assume you can't from the channel you're currently using. In that case, please answer the following questions to help me get your bus information:");
            session.replaceDialog('/noLocation');
        }
    );
}

