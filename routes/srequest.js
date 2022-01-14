const SQL = require('../queries/queries.json');
var axios = require('axios');
var querystring = require('querystring');
const dotenv = require('dotenv').config()

const client_id = process.env.CLIENTID;
const client_secret = process.env.CLIENTSECRET;

async function make_request(options,conn,sessid){

    console.log(options)
    console.log(options.url)
    console.log(options.headers)
    console.log('xdoptions')
    var res = await axios({
        method: 'get',
        url: options.url,
        headers: options.headers,
        json:true        
    });
    if(res.statusCode == 200){
        return res.data;
    }
    else {
        var ret = await conn.one(SQL.Users.get_refresh,[sessid]);
        var refresh_token = ret.refreshtoken; 
        var res2 = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
            params:{
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
            },
            json:true        
        });
        if(res2.statusCode === 200){
            console.log('res2 data')
            console.log(res2.data);
        }
    }
    console.log(res.data)
    return res.data;
}

module.exports = make_request;