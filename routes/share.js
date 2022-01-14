var express = require('express');
const SQL = require('../queries/queries.json');
var request = require('request');
var querystring = require('querystring');

module.exports = function(conn,prod) {
    var router = express.Router();

    router.post('/track', async function(req, res) {
        var sessid = req.session.id;
        try {
            var ret = await conn.oneOrNone(SQL.Users.get_user_spid,sessid);
            if(!ret) {
                res.status(401).send("Unauthorized");
            }
            else {
               var uuid = ret.uuid; 
               var uuids=req.body.list.uuids;
               var track=req.body.track;
               var msg=req.body.msg;
               var clipmarks=req.body.val;
               var pos = uuids.indexOf('followers');
               var track_uuid;
               if(uuids.length>0){
                    await conn.none(SQL.Tracks.put_track,[track.id,uuid,clipmarks.start,clipmarks.end,msg]);
                    track_uuid = await conn.one(SQL.Tracks.get_uuid,[track.id,uuid,clipmarks.start,clipmarks.end,msg])
                    track_uuid = track_uuid.trackid
               }
               else {
                   throw "No users sent to!"
               }
               if(pos!=-1){
                    uuids.splice(pos,1);
                    var followers = await conn.manyOrNone(SQL.Relationships.get_following_uuid,uuid);
                    if(followers){
                        for(var i=0;i<followers.length;i++){
                             pos = uuids.indexOf(followers[i].uuid);
                             if(pos!=-1){
                                 //do nothing
                             }
                             else {
                                 console.log(followers);
                                 console.log(followers[i]);
                                 var follow_uuid = followers[i].uuid;
                                 conn.tx(async t=>{
                                     var playlist = await t.one(SQL.Playlists.get_playlist_f,[follow_uuid]);
                                     var data = playlist.data;
                                     [].push.call(data,track_uuid);
                                     await t.none(SQL.Playlists.put_playlist,[data,follow_uuid,playlist.playlistid]);
                                 })
                             }
                        }
                    }
               }
               for(var j=0;j<uuids.length;j++){
                   var uuidtx = uuids[j]
                    conn.tx(async t=>{
                        console.log('xdxd')
                        var playlist = await t.one(SQL.Playlists.get_playlist_s,[uuidtx,uuid]);
                        var data = playlist.data;
                        var push = [].push;
                        push.call(data,track_uuid);
                        await t.none(SQL.Playlists.put_playlist,[data,uuidtx,playlist.playlistid]);
                    })
               }
               
               res.status(200).send("OK");
            }
            
        }
        catch(e) {
            console.log(e);
            res.redirect('/login_error');
        }
    });

    router.post('/change_config', async function(req, res) {
        var sessid = req.session.id;
        var playlistid = req.body.playlist.playlistdata.id;
        var list = req.body.list.uuids;
        console.log(list);
        console.log(playlistid);
        console.log('hmehme');
        try{    
            var ret = await conn.one(SQL.Users.get_user_spid,[sessid]);
            var uuid = ret.uuid;
            var pos = list.indexOf('followers');
            if(pos>-1){
                list.splice(pos,1);
                await conn.none(SQL.Playlists.remove_following,[uuid]);
                await conn.none(SQL.Playlists.change_following,[true,uuid,playlistid])
            }
            for(var i=0;i<list.length;i++){
                let ouuid = list[i];
                conn.tx(async t=>{
                    console.log()
                    var playlist = await t.one(SQL.Playlists.find_id_contributer,[uuid,ouuid])
                    var contributers = playlist.contributers;
                    var pos2 = [].indexOf.call(contributers,list[i]);
                    [].splice.call(contributers,pos2,1);
                    await t.none(SQL.Playlists.put_contributers,[contributers,uuid,playlist.playlistid]);

                    var playlist2 = await t.one(SQL.Playlists.get_contributers,[uuid,playlistid]);
                    contributers = playlist2.contributers;
                    [].push.call(contributers,ouuid);
                    await t.none(SQL.Playlists.put_contributers,[contributers,uuid,playlistid]);
                });
            }
            res.status(200).send("OK");
        }   
        catch(e){
            console.log(e);
            res.status(400).send("Error");
        }
    });


    return router;
}