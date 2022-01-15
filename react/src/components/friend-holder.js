import axios from 'axios';
import React from 'react';
import Usercard from './usercard';

function Friendholder({users,banner,update}) {
    console.log(users);

    function addFriend(event,user){
        axios.post('/user/make_relationship', {
            user: user,
            type: "add",
            status: "friend"
        })
        .then(function (res) {
            console.log(res);
            if(res.status == 200){
                update({res: res.data, method:"addFriend"});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    function removeFriend(event,user){
        axios.post('/user/make_relationship', {
            user: user,
            type: "remove",
            status: "friend"
        })
        .then(function (res) {
            console.log(res);
            if(res.status == 200){
                update({res: res.data, method:"removeFriend"});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    function addFollow(event,user){
        axios.post('/user/make_relationship', {
            user: user,
            type: "add",
            status: "following"
        })
        .then(function (res) {
            console.log(res);
            if(res.status == 200){
                update({res: res.data, method:"addFollow"});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    function removeFollow(event,user){
        axios.post('/user/make_relationship', {
            user: user,
            type: "remove",
            status: "following"
        })
        .then(function (res) {
            console.log(res);
            if(res.status == 200){
                update({res: res.data, method:"removeFollow"});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    return(
        <div className='space-x-3 pl-10 w-auto'>
            <div className='pr-5'>
                <p className='text-white text-3xl font-semibold'>{banner}</p>
            </div>
            <div className='space-y-5 space-x-5 pt-5 grid grid-cols-4 grid-flow-row gap-1'>
                <>
                    {users.map((user)=> (
                        <Usercard img={user.img?user.img:require('../MissingArtist.png')} 
                        status={user.status?user.status:null} name={user.d_name} data={user} addFriend={addFriend} removeFriend={removeFriend} addFollow={addFollow}
                        removeFollow={removeFollow}/>
                    ))}
                </>
            </div>
        </div>
    );

};

export default Friendholder;