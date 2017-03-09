module.exports = function () {
    bot.dialog('/noLocation', [
        (session, args, next) => {
            if(session.userData.busnum == ''){
                session.beginDialog('/getBusNum');
            }else{
                next();
            }      
        },
        (session, args, next) => {
            session.beginDialog('/getBusStop');
        },
        (session, args, next) => {
            session.beginDialog('/getTowards');
        },
        (session, args, next) => {
            session.replaceDialog('/checkArrivals');
        }
    ]);
}

