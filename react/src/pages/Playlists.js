import React, {useState,useEffect} from 'react';
import useRequireAuth from '../components/use-require-auth';
import Navbar from '../components/navbar';
import Card from '../components/card';
import axios from 'axios';
import querystring from 'querystring';
import PlaylistPage from '../components/playlist-page';
import Modal from '../components/newplayModal';
import ConfigCentri from '../components/configContri';

function Playlists(props) {
    const auth = useRequireAuth();
    const [playlists,SetPlaylists] = useState(null);
    const [playlist,SetPlaylist] = useState(null);
    const [playlistid,SetPlaylistId] = useState(null);
    const [update,SetUpdate] = useState(null);
    const [open,SetOpen] = useState(false);
    const [contris,SetContris] = useState(null);
    const [configContri,SetConfig] = useState(false);

    useEffect(()=>{
        axios
            .get('/user/playlists')
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    console.log("xddd");
                    console.log(res);
                    SetPlaylists(res.data);
                }
                else {
                    SetPlaylists(null);
                }
            })
            .catch(err => {
                console.log("login error: ", err);
                SetPlaylists(null);
            });
    },[update])

    useEffect(() =>{
        if(playlistid){
            axios
            .get('/user/playlist?'+
                querystring.stringify({
                    id: playlistid.id,
                })
            )
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    SetPlaylist({playlistdata:playlistid,tracks:res.data});
                }
                else {
                    SetPlaylist(null);
                }
            })
            .catch(err => {
                console.log("login error: ", err);
                SetPlaylist(null);
            });
        }
    },[playlistid,update])

    function handleClick(event,data) {
        console.log("xd")
        console.log(data)
        SetPlaylistId({
            id:data.playlistid,
            name:data.name,
            contributers:data.contributers
        });
    }
    function newPlaylist(name){
        console.log('hehe')
        console.log(name);
        axios.post('/user/new_playlist',{
            name: name
        })
        .then(function (res){
            if(res.status==200){
                SetOpen(false);
                SetUpdate(name);
            }
        })
        .catch(function (error){
            console.log(error);
        })
    }
    function delete_playlist(data){
        axios.post('/user/remove_playlist',{
            playlistid:data.playlistdata.id
        })
        .then(function (res){
            if(res.status === 200){
                SetPlaylist(null);
                SetPlaylistId(null);
                SetUpdate(data.playlistdata);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    function deletesong(data){
        console.log(data);
        axios.post('/user/remove_song', {
            data: data.meta,
            playlistid: playlistid.id
        })
        .then(function (res) {
            console.log(res);
            if(res.status === 200){
                SetUpdate(data.meta);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function back(){
        SetPlaylist(null);
        SetPlaylistId(null);
    }
    function openModal(e,data){
        SetOpen(true);
    }
    function postConfig(playlist,list){
        console.log(playlist,list);
        axios.post('/share/change_config',{
            playlist:playlist,
            list:list
        })
        .then(function (res){
            if(res.status==200){
                SetConfig(false);
            }
        })
    }
    if(!auth) {
        return <div><h3>Loading</h3></div>
    }
    return (
        <div className='h-screen x-screen overflow-hidden bg-stone-900'>
            <Modal open={open} SetOpen={SetOpen} confirm={newPlaylist}/>
            <main className='flex items-start'>
                <Navbar auth={auth}/>
                <div className='h-screen overflow-y-scroll scrollbar-hide'>
                    {configContri?<ConfigCentri playlist={playlist} SetConfig={SetConfig} postConfig={postConfig}/>
                    :playlist?<PlaylistPage playlist={playlist} deletesong={deletesong} back={back} delete_playlist={delete_playlist} openConfig={SetConfig}/>:
                        playlists?<div className='pt-28 pl-10 grid grid-cols-7 grid-flow-row gap-4 justify-items-center items-center'>
                            <>
                                {playlists.map((item) =>(
                                    <Card img={item.img?item.img:require('../MissingAlbum.png')} title={item.name} data={item}
                                    handleClick={handleClick}/>
                                ))}

                                <Card img={require('../MissingAlbumPlus.png')} title={'New Playlist'} data={null} handleClick={openModal}/>
                                
                            </>
                        </div>:null}
                </div>
            </main>
        </div>
    );
}

export default Playlists;