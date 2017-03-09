require('./config.js')();
require('./connectorSetup.js')();

require('./dialogs/checkArrivals.js')();
require('./dialogs/findByBusNum.js')();
require('./dialogs/findByClosestBusStop.js')();
require('./dialogs/findByQuery.js')();
require('./dialogs/getBusNum.js')();
require('./dialogs/getBusStop')();
require('./dialogs/getTowards')();
require('./dialogs/location.js')();
require('./dialogs/nolocation.js')();
require('./dialogs/selectBus.js')();
require('./dialogs/selectDirection')();

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^bye/i }); 
bot.beginDialogAction('home', '/start', { matches: /^home/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i }); 

bot.dialog('/', intents);
intents.matches('None', '/start')
.matches('findbylocation', '/findByClosestBusStop')
.matches('findbybusnum', '/findByBusNum')
.matches('detailedquery', '/findByQuery')
.matches('greeting', '/greeting')
.matches('setlocation', '/location')
.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

bot.dialog('/start', [
    (session) => {
        session.send("I am Bus Bot, your one stop shop for travelling with busses in London! My purpose in life is to help you find information about bus times in London."); 
        session.sendTyping();
        session.replaceDialog('/help');
    }  
]);

bot.dialog('/greeting', [
    (session) => {
        session.endDialog("Hey there!");
    }  
]);

bot.dialog('/help', [
    (session) => {
        session.endDialog("Here are some example statements you can say to me: \n\n* Next bus \n* When is the 28 coming \n* When is the next 28 from townmead road to wandsworth");
    }  
]);

