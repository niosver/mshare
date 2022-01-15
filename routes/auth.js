var express = require('express');
var querystring = require('querystring');
var request = require('request');
const SQL = require('../queries/queries.json');

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = function(conn,client_id,client_secret,stateKey, redirect_uri,prod) {
    var router = express.Router();
    
    router.get('/login_spotify', function(req,res) {
        var state = generateRandomString(16);
        res.cookie(stateKey, state, {httpOnly: true, secure: prod});
        res.cookie("temp_session_id", req.session.id,{httpOnly:true, secure: prod});
        
        var scope = 'user-read-private';

        res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
    });

    router.get('/callback', function(req,res) {
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
        var sessid = req.cookies ? req.cookies["temp_session_id"] : null;
        if (state === null || state !== storedState) {
            //state mismatch deny and restart auth
            console.log("state error")
            res.redirect('/login_error')
        } else {
            res.clearCookie(stateKey);
            res.clearCookie("temp_session_id");
            var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
            };
        
            request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
        
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
        
                var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
                };
                // use the access token to access the Spotify Web API
                request.get(options, async function(error, response, body) {
                //get user information
                    //create new user in db if not exist, otherwise add sessid to db and redirect them to
                    //home page with instructions to lookup user
                    //also write auth and refresh tokens in
                    
                    try {
                        console.log(body);
                        var img = body.images?body.images[0]?body.images[0].url:null:null;
                        var test = await conn.oneOrNone(SQL.Users.find_user,body.id);
                        if(!test) {
                            await conn.none(SQL.Users.create_user,[sessid,access_token,refresh_token,body.id,img,body.display_name]);
                            var u = await conn.one(SQL.Users.get_user_spid,[sessid]);
                            await conn.none(SQL.Playlists.create_default_playlist,[u.uuid,[],[]]);
                        }
                        else {
                            await conn.none(SQL.Users.update_user,[sessid,access_token,refresh_token,img,body.display_name,test.uuid]);
                        }
                        res.redirect('/')
                    }
                    catch(e) {
                        console.log(e);
                        res.redirect('/login_error');
                    }
                });
            } else {
                //invalid token reset auth
                console.log("invalid token");
                res.redirect('/login_error');
            }
            });
        }

    });

    return router;
}
