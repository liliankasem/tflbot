module.exports = function () {
    bot.dialog('/transportMode', [
        (session) => {
            var promptMsg = "How will you be travelling today?";
            var choices = ["Bus", "Tube"];
            builder.Prompts.choice(session, promptMsg, choices, { listStyle: builder.ListStyle.button });
        },
        function (session, results) {
            if (results.response) {
                var selection = results.response.entity;
                // route to corresponding dialogs
                switch (selection) {
                    case "Bus":
                        session.replaceDialog('/findByClosestBusStop');
                        break;
                    case "Tube":
                        session.replaceDialog("/tubeArrivals")
                        break;
                    default:
                        session.reset('/');
                        break;
                }
            }
        }
    ]);
}

