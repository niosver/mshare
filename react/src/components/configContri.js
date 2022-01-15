import React,{useState,useEffect} from 'react';
import {CheckIcon} from '@heroicons/react/outline';
import axios from 'axios';

function ConfigCentri({playlist,SetConfig,postConfig}){
    const [list,updateList] = useState({uuids:[]});
    const [friends,setFriends] = useState(null);
    console.log(playlist);
    function addList(event,data){
        console.log(list);
        list.uuids.push(data);
        updateList({uuids: list.uuids});
    }
    function removeList(event,data){
        var pos = list.uuids.indexOf(data);
        list.uuids.splice(pos,1);
        updateList({uuids:list.uuids});
    }

    useEffect(() => {
        axios
        .get('/search/friends_full')
        .then(res => {
            console.log(res);
            if(res.status === 200 && res.data.length) {
                setFriends(res.data);
            }
            else {
                setFriends(null);
            }
        })
        .catch(err => {
            console.log("login error: ", err);
            setFriends(null);
        });
    },[])
    return (
        <div className='bg-stone-900 h-screen w-screen overflow-scroll-y scrollbar-hide overflow-y-scroll scrollbar-hide'>
            <div className='flex p-10 items-center'>
                <img className='h-72 w-72 object-cover' alt="album art" src={require('../MissingAlbum.png')}/>
                <div className='p-5 pr-96 self-end pb-0'>
                    <p className='text-white text-7xl line-clamp-2 pb-3'>{playlist.playlistdata.name} </p>
                </div>
            </div>
            <hr></hr>
            <p className='text-white text-center'>Each user can only be a contributer of a single playlist, selecting a user here will remove them from
                other playlists.</p>
            <div className='space-y-5 space-x-5 pt-5 grid grid-cols-5 grid-flow-row gap-1 pl-5 pr-5'>
                <>  
                    {list.uuids.indexOf('followers')===-1?<button onClick={(e)=>addList(e,'followers')} className='w-auto m-0 p-0 self-end'>
                            <div className='flex items-center p-1 hover:bg-stone-700 w-auto rounded-md bg-stone-800 justify-between min-w-fit'>
                                <img className="h-10 w-10" src={require('../MissingArtist.png')} alt="profile"/>
                                <div className='text-white overflow-hidden flex ml-3 mr-3 min-w-0'>
                                    <p className='font-semibold truncate'>Followers</p>
                                </div>
                                <CheckIcon className=' h-7 w-7 text-red-900 min-w-fit'/>
                            </div>
                        </button>
                        :<button onClick={(e)=>removeList(e,'followers')} className='w-auto m-0 p-0 self-end'>
                        <div className='flex p-1 items-center hover:bg-stone-700 w-auto rounded-md bg-stone-800 justify-between min-w-fit'>
                                <img className="h-10 w-10" src={require('../MissingArtist.png')} alt="profile"/>
                                <div className='text-white overflow-hidden flex ml-3 mr-3 min-w-0'>
                                    <p className='font-semibold truncate'>Followers</p>
                                </div>
                                <CheckIcon className=' h-7 w-7 text-green-300 min-w-fit'/>
                            </div>
                        </button>}
                    {friends?friends.map((friend) =>(
                        list.uuids.indexOf(friend.uuid)===-1?<button onClick={(e)=>addList(e,friend.uuid)} className='w-auto m-0 p-0'>
                        <div className='flex items-center p-1 hover:bg-stone-700 w-auto rounded-md bg-stone-800 justify-between min-w-fit'>
                            <img className="h-10 w-10" src={friend.img?friend.img:require('../MissingArtist.png')} alt="profile"/>
                            <div className='text-white overflow-hidden flex ml-3 mr-3 min-w-0'>
                                <p className='font-semibold truncate'>{friend.d_name}</p>
                            </div>
                            <CheckIcon className=' h-7 w-7 text-red-900 min-w-fit'/>
                        </div>
                    </button>
                    :<button onClick={(e)=>removeList(e,friend.uuid)} className='w-auto m-0 p-0'>
                    <div className='flex p-1 items-center hover:bg-stone-700 w-auto rounded-md bg-stone-800 justify-between min-w-fit'>
                            <img className="h-10 w-10" src={friend.img?friend.img:require('../MissingArtist.png')} alt="profile"/>
                            <div className='text-white overflow-hidden flex ml-3 mr-3 min-w-0'>
                                <p className='font-semibold truncate'>{friend.d_name}</p>
                            </div>
                            <CheckIcon className=' h-7 w-7 text-green-300 min-w-fit'/>
                        </div>
                    </button>
                    )):null}
                </>
            </div>
            <div className='flex p-10 justify-center'>
                <p className='text-white text-3xl'>Change Contributers:</p>
            </div>
            <div className='flex p-10 justify-center items-center space-x-24'>
                <button className='flex items-center bg-green-300 p-5 rounded-lg pl-10 pr-10' onClick={()=>postConfig(playlist,list)}>
                    <p className='text-black text-2xl'>Ok</p>
                </button>
                <button className='flex items-center bg-red-300 p-5 rounded-lg pl-10 pr-10' onClick={()=>{SetConfig(false)}}>
                    <p className='text-black text-2xl'>Cancel</p>
                </button>
            </div>
        </div>
    );
}

export default ConfigCentri;