module.exports = function () {

    global.restify = require('restify');
    global.builder = require('botbuilder');
    global.tfl = require('tfl.api')(tflId, tflKey);

    var connector = new builder.ChatConnector({
        appId: appId,
        appPassword: appPassword
    });

    global.bot = new builder.UniversalBot(connector);

    // Setup Restify Server
    var server = restify.createServer();
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser()); 
    server.listen(process.env.port || 3978, function () {
        console.log('%s listening to %s', server.name, server.url);
    });
    server.post('/api/messages', connector.listen());

    // LUIS
    var model = luisModel;
    var recognizer = new builder.LuisRecognizer(model);
    global.intents = new builder.IntentDialog({ recognizers: [recognizer] });

    // Middleware
    bot.use(
        builder.Middleware.dialogVersion({ version: 0.2, resetCommand: /^reset/i }),
        builder.Middleware.sendTyping()
    );

}