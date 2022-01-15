import React, {useState, useEffect} from 'react';
import useRequireAuth from '../components/use-require-auth';
import Navbar from '../components/navbar';
import Searchbar from '../components/searchbar';
import axios from 'axios';
import querystring from 'querystring';
import Albumholder from '../components/album-holder';
import Artistholder from '../components/artist-holder';
import Trackholder from '../components/track-holder';

function Music(props) {
    const auth = useRequireAuth();
    const [input,setInput] = useState('');
    const [music,setMusic] = useState(null);

    function handleSearch(event) {
        const search = event.target.value;
        console.log(search)
        setInput(search);
        var offset = 0;
        axios
            .get('/search/music?'+
                querystring.stringify({
                    q: search,
                    offset: offset
                })
            )
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    setMusic(res.data);
                }
                else {
                    setMusic(null);
                }
            })
            .catch(err => {
                console.log("login error: ", err);
                setMusic(null);
            });
    }

    const clearSearch = () => {
        setMusic(null);
        setInput('');
    };

    function handleSubmit(event) {
        event.preventDefault();
    };

    if(!auth) {
        return <div><h3>Loading</h3></div>
    }
    return (
        <div className='h-screen x-screen overflow-hidden bg-stone-900'>
            <main className='flex items-start'>
                <Navbar auth={auth}/>
                <div className='h-screen overflow-y-scroll scrollbar-hide'>
                    <Searchbar search={input} setSearch={handleSearch} handleSubmit={handleSubmit}/>
                    <div className='p-2 space-y-5'>
                        {music?<Trackholder tracks={music.tracks}/>:null}
                        {music?<Albumholder albums={music.albums}/>:null}
                        {music?<Artistholder artists={music.artists}/>:null}
                    </div>
                </div>
            </main>
        </div>
        
        // <div className='wrapper'>
        //     <nav id="sidebar">
        //         <Navbar auth={auth}/>
        //     </nav>
        //     {/* <div>
        //         <Searchbar search={input} setSearch={handleSearch} handleSubmit={handleSubmit}/>
        //         <div className='container'>
        //             {music?<Trackholder tracks={music.tracks}/>:null}
        //             {music?<Albumholder albums={music.albums} handleClick={handleClick}/>:null}
        //             {music?<Artistholder artists={music.artists}/>:null}
        //         </div>
        //     </div> */}
        // </div>
    );
}

export default Music;