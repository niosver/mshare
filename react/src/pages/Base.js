// import '../App.css';
import Home from "./Home";
import Music from "./Music";
import Playlists from "./Playlists";
import Relationships from "./Relationships";
import Login from './Login';
import Sharing from './Sharing';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
import React, {useEffect} from 'react';
import {useAuth} from '../components/use-auth';

function Base(props) {
    const auth = useAuth();
    useEffect(() => {
        auth.signin();
    },[]);
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/search" element={<Music/>} />
                    <Route path="/social" element={<Relationships />} />
                    <Route path="/playlists" element={<Playlists />} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/sharing" element={<Sharing/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Base;
