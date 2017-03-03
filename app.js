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
bot.beginDialogAction('home', '/greeting', { matches: /^home/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i }); 

bot.dialog('/', intents);
intents.matches('None', '/help')
.matches('findbylocation', '/findByClosestBusStop')
.matches('findbybusnum', '/findByBusNum')
.matches('detailedquery', '/findByQuery')
.matches('greeting', '/greeting')
.matches('setlocation', '/location')
.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

bot.dialog('/greeting', [
    (session) => {
        session.send("Hey there!"); 
        session.replaceDialog('/help');
    }  
]);

bot.dialog('/help', [
    (session) => {
        session.endDialog("Example commands that you can try: \n\n* Next bus \n* When is the 28 coming \n* When is the next 28 from townmead road to wandsworth \n* help - Displays these commands.");
    }  
]);

