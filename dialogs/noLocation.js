module.exports = function () {
    bot.dialog('/noLocation', [
        (session) => {
            session.beginDialog('/getBusNum');
        },
        (session) => {
            session.beginDialog('/getBusStop');
        },
        (session) => {
            session.beginDialog('/getTowards');
        },
        (session) => {
            session.replaceDialog('/checkArrivals');
        }
    ]);
}

