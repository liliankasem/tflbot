module.exports = function () {
    bot.dialog('/findByQuery', [
        (session, args, next) => {
            if(args != null){
                var busnum  = builder.EntityRecognizer.findEntity(args.entities, 'busnum');
                var busstop = builder.EntityRecognizer.findEntity(args.entities, 'busstop');
                var towards = builder.EntityRecognizer.findEntity(args.entities, 'towards');
            
                if (!busnum) {
                    session.beginDialog('/getBusNum');
                } else {
                    session.userData.busnum = busnum.entity;
                }

                if (!busstop) {
                    session.beginDialog('/getBusStop');
                } else {
                    session.userData.busstop = busstop.entity;
                }       

                if (!towards) {
                    session.beginDialog('/getTowards');
                } else {
                    session.userData.towards = towards.entity;           
                }

                if(busnum && busstop && towards){
                    next();
                }           
                
            }else{
                session.replaceDialog('/noLocation');
            }      
        }, 

        (session, args, next) => {       
            session.replaceDialog('/checkArrivals');
        }
    ]);
}

