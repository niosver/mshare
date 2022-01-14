var express = require('express');
const SQL = require('../queries/queries.json');
var request = require('request');
var querystring = require('querystring');

module.exports = function(conn,prod) {
    var router = express.Router();

    router.get('/music', async function(req, res) {
        var sessid = req.session.id;
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_access,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {

                var access_token = ret.authtoken;
                var options = {
                    url: 'https://api.spotify.com/v1/search?'+
                        querystring.stringify({
                            q: req.query.q,
                            type:"track,album,artist",
                            limit:10,
                            offset:req.query.offset
                        })
                    ,
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                // use the access token to access the Spotify Web API
                request.get(options, async function(error, response, body) {
                    if(!error && response.statusCode === 200) {
                        res.status(200).send(body);
                    }
                    else if(response.statusCode === 401) {
                        //unauthorized need to refresh or get new access token
                        
                    }
                });
            }
            
        }
        catch(e) {
            console.log(e);
            res.redirect('/login_error');
        }

        
    });

    router.get('/friends', async function(req, res) {
        var sessid = req.session.id;
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_user_spid,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
                var uuid = ret.uuid;
                console.log(uuid);
                var side1 = await conn.any(SQL.Relationships.get_socialo,uuid);
                console.log(side1);
                var side2 = await conn.any(SQL.Relationships.get_socialu,uuid);
                console.log(side2);
                var users = side1.concat(side2);
                console.log(users);

                for(var i=0;i<users.length;i++){
                    var ret = await conn.oneOrNone(SQL.Relationships.check_follow,[uuid,users[i].uuid]);
                    if(ret){
                        users[i].following="true";
                    }
                    else {
                        users[i].following="false";
                    }
                }
                
                res.status(200).send(users);
            }
            
        }
        catch(e) {
            console.log(e);
            res.redirect('/login_error');
        }

    });

    router.get('/users', async function(req, res) {
        var sessid = req.session.id;
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_user_spid,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
                var uuid = ret.uuid;
                var spid = ret.spid;
                var userslike = await conn.any(SQL.Users.search_users,['%'+req.query.q+'%',spid,25]);
                console.log(userslike);
                
                for(var i=0; i<userslike.length;i++){
                    console.log(userslike[0])
                    var status = await conn.oneOrNone(SQL.Relationships.get_status,[uuid,userslike[i].uuid]);
                    console.log(status);
                    if(status){
                        userslike[i].status = status.status;
                        userslike[i].orig = status.orig;
                    }
                    else{
                        userslike[i].status = "none";
                        userslike[i].orig = null;
                    }
                    var ret = await conn.oneOrNone(SQL.Relationships.check_follow,[uuid,userslike[i].uuid]);
                    if(ret){
                        userslike[i].following="true";
                    }
                    else{
                        userslike[i].following="false";
                    }
                }
                console.log(userslike);
                res.status(200).send(userslike);

            }
            
        }
        catch(e) {
            console.log(e);
            res.redirect('/login_error');
        }

    });


    router.get('/friends_full', async function(req, res) {
        var sessid = req.session.id;
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_user_spid,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
                var uuid = ret.uuid;
                var side1 = await conn.any(SQL.Relationships.get_friends_o,uuid);
                console.log(side1);
                var side2 = await conn.any(SQL.Relationships.get_friends_u,uuid);
                console.log(side2);
                var side3 = await conn.any(SQL.Relationships.get_follows,uuid)
                var friends = side1.concat(side2);
                var friendsAndFollows = friends.concat(side3);
                res.status(200).send(friendsAndFollows);
            }
            
        }
        catch(e) {
            console.log(e);
            res.redirect('/login_error');
        }

    });

    return router;
};