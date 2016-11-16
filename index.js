// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://heroku_4wr3p8c1:5pq3k7ij82sikdpkbfjaa31mk@ds147797.mlab.com:47797/heroku_4wr3p8c1',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'yve80c5d',
    masterKey: process.env.MASTER_KEY || 'wvpy3f1k', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'https://dictionary-1.herokuapp.com/parse', // Don't forget to change to https if needed
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    },
    // 以下為新增部分
    push: {
        // 此篇未提到 Android，因此註解掉
        // android: {
        //   senderId: '...',
        //   apiKey: '...'
        // },
        ios: [{
            pfx: __dirname + '/iPhoneP12/com.arata1972.arabic.french.dict store.p12',
            bundleId: 'com.arata1972.arabic.french.dict',
            production: true
        }, {

            pfx: __dirname + '/iPhoneP12/com.arata1972.persian.french.dict store.p12',
            bundleId: 'com.arata1972.persian.french.dict',
            production: true
        }, {
            pfx: __dirname + '/iPhoneP12/com.arata1972.japanese.italian.dict store.p12',
            bundleId: 'com.arata1972.japanese.italian.dict',
            production: true
        }, {

            pfx: __dirname + '/iPhoneP12/com.arata1972.chinese.lao.dict store.p12',
            bundleId: 'com.arata1972.chinese.lao.dict',
            production: true
        }, {
            pfx: __dirname + '/iPhoneP12/com.arata1972.thai.koren.dict store.p12',
            bundleId: 'com.arata1972.thai.koren.dict',
            production: true
        }, {
            pfx: __dirname + '/iPhoneP12/com.arata1972.chinese.nepali.dict store.p12',
            bundleId: 'com.arata1972.chinese.nepali.dict',
            production: true
        }, {
            pfx: __dirname + '/iPhoneP12/com.arata1972.japanese.tagalog.dict store.p12',
            bundleId: 'com.arata1972.japanese.tagalog.dict',
            production: true
        }, {
            pfx: __dirname + '/iPhoneP12/com.arata1972.japanese.indonesian.dict store.p12',
            bundleId: 'com.arata1972.japanese.indonesian.dict',
            production: true
        }]
    },
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
