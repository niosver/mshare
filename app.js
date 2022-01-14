var express = require('express');
var cors = require('cors');
var session = require('express-session');
const dotenv = require('dotenv').config()
var pgp = require('pg-promise')();
var cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');


var co = {
  host: process.env.DBHOST,
  post: process.env.DBPORT,
  database: process.env.DB,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  max: 30,
  keepAlive: true,
  allowExitOnIdle: false
}
const db = pgp(co);

var sess_secret = process.env.SESSSECRET;

const client_id = process.env.CLIENTID;
const client_secret = process.env.CLIENTSECRET;
const redirect_uri = process.env.REDIRECT;
const stateKey = "spotify_auth_state";
const prod = process.env.PROD === "PROD"?true:false;

console.log(redirect_uri);

var app = express();
app.use(express.static(__dirname + '/public/build'))
    .use(cors())
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended:true}))
    .use(bodyParser.json())
    .use(session({
        secret: sess_secret,
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 864_000_000,
            secure: prod,
        }
    }));

app.use('/auth', require('./routes/auth')(db,client_id,client_secret,stateKey,redirect_uri,prod));
app.use('/user',require('./routes/user')(db,prod));
app.use('/search',require('./routes/search')(db,prod));
app.use('/share',require('./routes/share')(db,prod));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname,'/public/build/index.html'))
});


module.exports = app;