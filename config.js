module.exports = function () {
    //process.env variables defined in Azure if deployed to a web app. For testing, place IDs and Keys inline
    global.appId = process.env.MICROSOFT_APP_ID ? process.env.MICROSOFT_APP_ID : '',
    global.appPassword = process.env.MICROSOFT_APP_PASSWORD ? process.env.MICROSOFT_APP_PASSWORD : ''
    global.luisModel = process.env.LUIS_MODEL ? process.env.LUIS_MODEL : '';
    global.tflId = process.env.TFL_APP_ID ? process.env.TFL_APP_ID :  '';
    global.tflKey = process.env.TFL_APP_KEY ? process.env.TFL_APP_KEY : '';
}