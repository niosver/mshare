const SQL = require('../queries/queries.json');

function refresh_token(sessid,conn,client_id,client_secret) {
    // requesting access token from refresh token
    //get refresh token from database
    try {
        var refresh_token = await conn.one(SQL.Users.get_refresh,sessid);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
            form: {
              grant_type: 'refresh_token',
              refresh_token: refresh_token
            },
            json: true
          };
        
          request.post(authOptions, async function(error, response, body) {
            if (!error && response.statusCode === 200) {
                //the refresh token API can return either just access token or both access token
                //and refresh token, handle both scenarios to avoid random complications
                var access_token = body.access_token;
                var refresh_token = body.refresh_token;
                if(refresh_token) {
                    await conn.none(SQL.Users.save_access_refresh,[access_token,refresh_token,sessid]);
                }
                else {
                    await conn.none(SQL.Users.save_access,[access_token,sessid]);
                }
                if(ret_address) {
                    res.redirect(ret_address);
                }
                else {
                    res.status(200).send("OK");
                }
                
            }
          });
    }
    catch(e) {
        console.log(e);
        res.redirect('/login_error');
    }
    
}

export default refresh_token;