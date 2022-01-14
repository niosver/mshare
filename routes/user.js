var express = require('express');
const SQL = require('../queries/queries.json');
var request = require('request');
var make_request = require('./srequest');
var querystring = require('querystring');

module.exports = function(conn,prod) {
    var router = express.Router();

    router.get('/me', async function(req, res) {

        var sessid = req.session.id;
        var user_prop = {
            display_name: null,
            img_url: null
        };
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_access,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
                var access_token = ret.authtoken;
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                // use the access token to access the Spotify Web API
                request.get(options, async function(error, response, body) {
                    if(!error && response.statusCode === 200) {
                        user_prop.display_name = body.display_name;
                        user_prop.img_url = body.images[0].url;
                        res.status(200).send(user_prop);
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

    router.post('/make_relationship', async function(req, res) {
        var sessid = req.session.id;
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_user_spid,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
               var uuid=ret.uuid;
               var type=req.body.status;
               var action=req.body.type;
               var ouuid=req.body.user.uuid;
               if(type === "friend"){
                    if(action==="add"){
                        var test = await conn.oneOrNone(SQL.Relationships.check_pend,[ouuid,uuid]);
                        if(test && test.status === 'pending'){
                            await conn.none(SQL.Relationships.add_friend_pend,[ouuid,uuid]);
                        }
                        else {
                            await conn.none(SQL.Relationships.add_friend,[uuid,ouuid]);
                            var playlist = await conn.one(SQL.Playlists.get_id_default,[uuid]);
                            var playlist2 = await conn.one(SQL.Playlists.get_id_default,[ouuid]);
                            conn.tx(async t=>{
                                var playl = await t.one(SQL.Playlists.get_contributers,[uuid,playlist.playlistid]);
                                var contributers = playl.contributers;
                                [].push.call(contributers,ouuid);
                                await t.none(SQL.Playlists.put_contributers,[contributers,uuid,playlist.playlistid]);
                            })
                            conn.tx(async t=>{
                                var playl = await t.one(SQL.Playlists.get_contributers,[ouuid,playlist2.playlistid]);
                                var contributers = playl.contributers;
                                [].push.call(contributers,uuid);
                                await t.none(SQL.Playlists.put_contributers,[contributers,ouuid,playlist2.playlistid]);
                            })
                        }
                    }
                    else if(action==="remove"){
                        await conn.none(SQL.Relationships.remove_friend,[uuid,ouuid]);
                    }
               }
               else if(type === "following"){
                    if(action==="add"){
                        await conn.none(SQL.Relationships.add_follow,[uuid,ouuid]);
                    }
                    else if(action==="remove"){
                        await conn.none(SQL.Relationships.remove_follow,[uuid,ouuid]);
                    }
               }
               res.status(200).send("OK");
            }
            
        }
        catch(e) {
            console.log(e);
            res.redirect('/login_error');
        }
    });

    router.get('/playlists', async function(req,res){
        var sessid = req.session.id;
        try{
            console.log('hmmm')
            var ret = await conn.oneOrNone(SQL.Users.get_user_spid,[sessid]);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
                console.log('hmxd')
                var uuid = ret.uuid;
                var playlists = await conn.manyOrNone(SQL.Playlists.get_playlists,[uuid]);
                console.log(playlists);
                console.log('test');
                res.status(200).send(playlists);
            }
        }
        catch(e){
            console.log(e);
            res.status(400).send("Unknown error");
        }
    });

    router.get('/playlist', async function(req,res){
        var sessid = req.session.id;
        if(!req.query.id){
            res.status(400).send("invalid id");
        }
        else {
            try{
                var ret = await conn.oneOrNone(SQL.Users.get_user_spid,[sessid]);
                if(!ret) {
                    res.status(401).send("Unauthorized");
                }
                else {
                    var ret2 = await conn.one(SQL.Users.get_access,[sessid]);
                    var access_token = ret2.authtoken;
                    var uuid = ret.uuid;
                    var playlistid = req.query.id;
                    console.log(uuid);
                    console.log(playlistid);
                    var playlist = await conn.oneOrNone(SQL.Playlists.get_playlist,[uuid,playlistid]);
                    console.log(playlist);
                    var song_data = [];
                    var id_list = "";
                    var cap = 50;
                    var playlist_songs = [];
                    var resolved_songs = [];
                    if(playlist.data.length>0){
                        for(var i=0;i<playlist.data.length;i++){
                            console.log(i)
                            var song = await conn.one(SQL.Tracks.get_track,[playlist.data[i]]);
                            var user_name = await conn.one(SQL.Users.get_dname,[song.sender]);
                            song.sender = user_name.d_name;
                            song_data.push(song);
                            if(id_list==""){
                                id_list = id_list+song.spid
                            }
                            else{
                                id_list = id_list + ','+song.spid
                            }
                            if(i+1%cap===0) {
                                var options = {
                                    url: 'https://api.spotify.com/v1/tracks?'+
                                        querystring.stringify({
                                            ids: id_list,
                                        })
                                    ,
                                    headers: { 'Authorization': 'Bearer ' + access_token },
                                    json: true
                                };
                                var body = await make_request(options,conn,req.sessionID);
                                if(body && body!==400){
                                    console.log('testxd')
                                    console.log(body)
                                    for(var k=0;k<body.tracks.length;k++){
                                        resolved_songs.push(body.tracks[k]);
                                    }
                                    id_list="";
                                }
                                else{
                                    res.redirect('/login');
                                    return;
                                }
                                
                            }
                        }
                        var options = {
                            url: 'https://api.spotify.com/v1/tracks?'+
                                querystring.stringify({
                                    ids: id_list,
                                })
                            ,
                            headers: { 'Authorization': 'Bearer ' + access_token },
                            json: true
                        };
                        console.log('hehe')
                        var body = await make_request(options,conn,req.sessionID);
                        console.log('xd');
                        console.log(body);
                        if(body && body!==400){
                            console.log('xdd')
                            for(var k=0;k<body.tracks.length;k++){
                                resolved_songs.push(body.tracks[k]);
                            }
                            id_list="";
                        }
                        else{
                            console.log('hehe')
                            res.redirect('/login');
                            return;
                        }
                        console.log('xddddd')
                        console.log(resolved_songs);
                        for(var j=0;j<song_data.length;j++){
                            playlist_songs.push({track:resolved_songs[j],meta:song_data[j]})
                        }
                        console.log('xdddddddddddd')
                        console.log(playlist_songs)
                        res.status(200).send(playlist_songs);
                    }
                    else{
                        res.status(200).send([])
                    }
                    
                }
            }
            catch(e){
                console.log(e);
                res.status(400).send("Unknown error");
            }
        }
        
    });

    router.post('/logout', async function(req,res){
        var sessid = req.sessionID;
        try{
            await conn.none(SQL.Users.remove_sessid,[sessid]);
            req.session.regenerate(function(err) {
                res.status(200).send("OK");
            })
        }
        catch{
            res.status(400).send("Error");
        }
        
    });

    router.post('/delete', async function(req,res){
        var sessid = req.sessionID;
        try{
            var ret = await conn.one(SQL.Users.get_user_spid,[sessid]);
            var uuid = ret.uuid;
            if(uuid){
                await conn.none(SQL.Users.remove_identifiers,[sessid]);
                await conn.none(SQL.Relationships.remove_friendships,[uuid]);
                await conn.none(SQL.Relationships.remove_following,[uuid]);
                await conn.none(SQL.Playlists.remove_playlists,[uuid]);
                req.session.regenerate(function(err) {
                    res.status(200).send("OK");
                })
            }
        }
        catch{
            res.status(400).send("Error");
        }
    });

    router.post('/remove_song', async function(req,res){
        try{
            console.log(req.body);
            var sessid = req.sessionID;
            var data = req.body.data;
            var playlistid = req.body.playlistid;
            var trackid = data.trackid;
            var ret = await conn.one(SQL.Users.get_user_spid,[sessid]);
            var uuid = ret.uuid;
            if(uuid){
                var ret = await conn.one(SQL.Playlists.get_playlist_data,[uuid,playlistid]);
                var pos = [].indexOf.call(ret.data,trackid);
                [].splice.call(ret.data,pos,1);
                await conn.none(SQL.Playlists.put_playlist_data,[ret.data,uuid,playlistid]);
                res.status(200).send("OK");
            }
        }
        catch(e){
            console.log(e);
            res.status(400).send("Error");
        }
    });

    router.post('/new_playlist', async function(req,res){
        try{
            console.log(req.body);
            var sessid = req.sessionID;
            var name = req.body.name
            if(name!='default'){
                var ret = await conn.one(SQL.Users.get_user_spid,[sessid]);
                var uuid = ret.uuid;
                if(uuid){
                    console.log(uuid);
                    await conn.none(SQL.Playlists.create_playlist,[uuid,name]);
                    res.status(200).send("OK");
                }
            }
            else{
                res.status(400).send("Can't use the name default for playlists")
            }
        }
        catch(e){
            console.log(e);
            res.status(400).send("Error");
        }
    });

    router.post('/remove_playlist', async function(req,res){
        try{
            console.log(req.body);
            var sessid = req.sessionID;
            var id = req.body.playlistid;
            var ret = await conn.one(SQL.Users.get_user_spid,[sessid]);
            var uuid = ret.uuid;
            if(uuid){
                var f = await conn.one(SQL.Playlists.check_following,[uuid,id]);
                var def_id = await conn.one(SQL.Playlists.get_id_default,[uuid])
                if(def_id.playlistid==id){
                    throw "Can't delete default playlist"
                }
                if(f.following){
                    conn.tx(async t=>{
                        console.log('xdxdhaha')
                        var playlist = await t.one(SQL.Playlists.get_contributers,[uuid,id]);
                        var contributers = playlist.contributers;
                        
                        var def_playlist = await t.one(SQL.Playlists.get_contributers,[uuid,def_id.playlistid]);
                        var def_cont = def_playlist.contributers;
                        console.log(contributers);
                        for(var i =0;i<contributers.length;i++){
                            [].push.call(def_cont,contributers[i]);
                        }
                        await t.none(SQL.Playlists.delete_playlist,[uuid,id]);
                        await t.none(SQL.Playlists.change_following,[true,uuid,def_id.playlistid])
                        await t.none(SQL.Playlists.put_contributers,[def_cont,uuid,def_id.playlistid])
                    })
                }
                else {
                    conn.tx(async t=>{
                        console.log('xdxdhaha')
                        var playlist = await t.one(SQL.Playlists.get_contributers,[uuid,id]);
                        var contributers = playlist.contributers;
                        
                        var def_playlist = await t.one(SQL.Playlists.get_contributers,[uuid,def_id.playlistid]);
                        var def_cont = def_playlist.contributers;
                        console.log(contributers);
                        for(var i =0;i<contributers.length;i++){
                            [].push.call(def_cont,contributers[i]);
                        }
                        await t.none(SQL.Playlists.delete_playlist,[uuid,id]);
                        await t.none(SQL.Playlists.put_contributers,[def_cont,uuid,def_id.playlistid])
                    })
                }

                res.status(200).send("OK");
            }
        }
        catch(e){
            console.log(e);
            res.status(400).send("Error");
        }
    });

    return router;
};