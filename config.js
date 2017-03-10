module.exports = function () {
    //process.env variables defined in Azure if deployed to a web app. For testing, place IDs and Keys inline
    global.appId = process.env.MICROSOFT_APP_ID ? process.env.MICROSOFT_APP_ID : '81e44383-4384-431f-87ba-69d0e9397db9',
    global.appPassword = process.env.MICROSOFT_APP_PASSWORD ? process.env.MICROSOFT_APP_PASSWORD : 'nBEqs1rSEtQaTEEAjpWboAh'
    global.luisModel = process.env.LUIS_MODEL ? process.env.LUIS_MODEL : 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ed1bd970-96fe-49b1-8458-7399389e81b6?subscription-key=27ec3b1c30c24b77b93f35c4bec5f4d9';
    global.tflId = process.env.TFL_APP_ID ? process.env.TFL_APP_ID :  '7a80c5e7';
    global.tflKey = process.env.TFL_APP_KEY ? process.env.TFL_APP_KEY : '6b109d6d19aa65eec5084845800355d5';
}