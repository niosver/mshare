import React,{useState,useEffect} from 'react';
import useRequireAuth from '../components/use-require-auth';
import { useNavigate, useLocation } from 'react-router-dom';
import {millisToMinutesAndSeconds} from '../components/time';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import {CheckIcon,UploadIcon} from '@heroicons/react/outline';
import axios from 'axios';

function Sharing(props){
    const auth = useRequireAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const {createSliderWithTooltip} = Slider;
    const Range = createSliderWithTooltip(Slider.Range);
    const {trackinf} = location.state;

    const [val,SetVal] = useState({start:0,end:trackinf.duration_ms});
    const [msg,SetMsg] = useState(null);
    const [list,updateList] = useState({uuids:[]});
    const [friends,setFriends] = useState(null);
    
    function updateValue(event){
        SetVal({start:event[0],end:event[1]});
    }
    function updateMsg(event){
        SetMsg(event.target.value);
    }
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
    function sendSong(){
        axios.post('/share/track',{
            msg:msg,
            val:val,
            list:list,
            track: trackinf
        })
        .then(res => {
            if(res.status===200){
                navigate(-1)
            }
        })
        .catch(err=>{

        })
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
    if(!auth) {
        return <div><h3>Loading</h3></div>
    }
    return (
        <div className='bg-stone-900 h-screen w-screen overflow-scroll-y scrollbar-hide overflow-y-scroll scrollbar-hide'>
            <div className='flex p-10 items-center'>
                <img className='h-72 w-72 object-cover' alt="album art" src={trackinf.album.images[0]?trackinf.album.images[0].url:null}/>
                <div className='p-5 pr-96 self-end pb-0'>
                    <p className='text-white text-7xl line-clamp-2 pb-3'>{trackinf.name} </p>
                    <p className='text-gray-300'>{trackinf.album.name}</p>
                    <p className='text-gray-300'>{millisToMinutesAndSeconds(trackinf.duration_ms)}</p>
                </div>
            </div>
            <hr></hr>
            <div className='flex p-10 justify-center'>
                <p className='text-white text-3xl'>Duration</p>
                <div className='space-y-10'>            
                </div>
            </div>
            <div className='flex p-10 items-center space-x-7 justify-center pt-5'>
                <p className='text-white'>{millisToMinutesAndSeconds(val.start)}</p>
                <div className='w-72'>
                    <Range className='p-20' min={0} max={trackinf.duration_ms} defaultValue={[val.start,val.end]} tipFormatter={value=>millisToMinutesAndSeconds(value)}
                    pushable={5000} step={1000} allowCross={false} onAfterChange={(e)=>updateValue(e)}/>
                </div>
                <p className='text-white'>{millisToMinutesAndSeconds(val.end)}</p>
            </div>
            <div className='flex p-10 justify-center'>
                <textarea  className='rounded-lg scrollbar-hide' name="message" rows='8' cols='75'
                    placeholder={'Type a message to send along with your clip...'} onChange={(e)=>updateMsg(e)}/>
            </div>
            <div className='flex p-10 justify-center'>
                <p className='text-white text-3xl'>Send to:</p>
            </div>
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
                <p className='text-white text-3xl'>Send:</p>
            </div>
            <div className='flex p-10 justify-center'>
                <button className='flex items-center bg-green-300 p-5 rounded-full pl-10 space-x-5' onClick={sendSong}>
                    <p className='text-black text-2xl'>Send</p>
                    <UploadIcon className='h-7 w-7 text-black'/>
                </button>
            </div>
        </div>
    );
}

export default Sharing;