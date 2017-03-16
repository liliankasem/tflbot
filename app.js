require('./utils.js')();
require('./config.js')();
require('./connectorSetup.js')();

require('./dialogs/displayResults.js')();
require('./dialogs/displayResultsAll.js')();
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
require('./dialogs/noLocationDataPass')();
require('./dialogs/transportMode')();
require('./dialogs/tubeArrivals')();
require('./dialogs/tubeStatus')();
require('./dialogs/selectLine')();
require('./dialogs/displayResultsTube')();


bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^bye/i }); 
bot.beginDialogAction('home', '/start', { matches: /^home/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i }); 

bot.dialog('/', intents);
intents.matches('None', '/start')
.matches('findbylocation', '/findByClosestBusStop')
.matches('findbybusnum', '/findByBusNum')
.matches('detailedquery', '/findByQuery')
.matches('greeting', '/start')
.matches('setlocation', '/location')
.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

bot.dialog('/start',
    (session) => {
        session.send("Hey there! I am Bus Bot, your one stop shop for travelling with buses in London! My purpose in life is to help you find information about bus times in London."); 

        session.replaceDialog('/mainMenu');
    }
);

bot.dialog('/mainMenu', [
    (session) => {
        var promptMsg = "What would you like to do?";
        var choices = ["Check Departure Times", "Tube Status Update"];
        builder.Prompts.choice(session, promptMsg, choices, { listStyle: builder.ListStyle.button });
    },
    (session, results) => {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Check Departure Times":
                    session.replaceDialog('/transportMode');
                    break;
                case "Tube Status Update":
                    session.replaceDialog("/tubeStatus")
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
])
.cancelAction('Cancel', 'Operation cancelled', {
    matches: /^cancel$/,
    onSelectAction: (session, args) => {
        session.endConversation(`Operation cancelled.`);
    },
    confirmPrompt: `Are you sure you wish to cancel?`
});


bot.dialog('/help', [
    (session) => {
        session.endDialog("Here are some example statements you can say to me: \n\n* Next bus \n* When is the 28 coming \n* When is the next 28 from townmead road to wandsworth");
    }  
]);

