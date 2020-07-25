
const
    compression = require('compression'),
    config = require('./config'),
    express = require('express'),
    app = express(),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    api_router =  require('./api/api.js'),
    cors = require('cors');

// option for use HTTPS
    const httpsOptions = {
    key: fs.readFileSync("./cert/citypay.key"),
    cert: fs.readFileSync("./cert/citypay.crt"),
    ca: fs.readFileSync("./cert/ca.crt"),
    requestCert: true,
    rejectUnauthorized: true
    };


// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Headers: X-Requested-With');
    res.header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
    next();
}


app.use(cors());
app.use(compression());
app.use(allowCrossDomain);
app.use('/', api_router);

let port = process.env.PORT || config.api_port;
let port_ssl = process.env.PORT || config.api_port_ssl;


let server = http.createServer(httpsOptions, app).listen(port, function(){
    console.log("Express server listening on port: " + port);
});

let server_ssl = https.createServer(httpsOptions, app).listen(port_ssl, function(){
    console.log("Express server listening on port ssl: " + port_ssl);
});
