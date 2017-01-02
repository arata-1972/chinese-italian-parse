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
    databaseURI: databaseUri || 'mongodb://heroku_fn9mdkwh:pfl9f4dng3ljlfs0kthn0r5ido@ds031845.mlab.com:31845/heroku_fn9mdkwh',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'kZz2odPUzXa1JzTKRqpbDuz3KI5777zhAqNy2jP4',
    masterKey: process.env.MASTER_KEY || 'QQf9qxfxoMjHxWR97fRIK6BJNp6RcxL5Mseh5Nlv', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'https://chinese-it.herokuapp.com/parse', // Don't forget to change to https if needed
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
                pfx: __dirname + '/iPhoneP12/com.satoshogoEnglishMongolian store.p12',
                bundleId: 'com.satoshogoEnglishMongolian',
                production: true
            }, 
              {
                pfx: __dirname + '/iPhoneP12/com.satoshogoEnglishTgaog store.p12',
                bundleId: 'com.satoshogoEnglishTgaog',
                production: true
            }, 
             {
                pfx: __dirname + '/iPhoneP12/com.satoshogo.EnglishTagalog.remake store.p12',
                bundleId: 'com.satoshogo.EnglishTagalog.remake',
                production: true
            }
        ]
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
