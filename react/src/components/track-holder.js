import React from 'react';
import {ShareIcon} from "@heroicons/react/outline";
import {millisToMinutesAndSeconds} from "./time"
import {Link} from 'react-router-dom';


function Trackholder({tracks}) {
    console.log(tracks);
    return(
        <div className='space-x-3 pl-10 w-auto'>
            <div className='flex justify-between pr-5'>
                <p className='text-white text-3xl font-semibold'>Songs</p>
                <p className='text-white text-lg self-end'>See All</p>
            </div>
            <div className='space-y-5 space-x-5 pt-5 grid grid-cols-2 grid-flow-row gap-1'>
                <>
                    {tracks.items.map((track) => (
                        <div className='flex justify-between p-1 hover:bg-stone-700 mt-5 ml-5 w-auto rounded-md'>
                            <div className='flex items-center'>
                                <img className="h-10 w-10" src={track.album.images[0]?track.album.images[0].url:require('../MissingAlbum.png')} alt="album art"/>
                                <div className='text-white pl-2 w-96'>
                                    <p className='font-semibold truncate'>{track.name}</p>
                                    <p className='text-sm truncate'>{track.artists?track.artists[0].name:'Unknown'}</p>
                                </div>
                            </div>
                            <div className='flex items-center text-white pr-5'>
                                <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
                                <Link to={{pathname: "/sharing"}} state={{trackinf:track}}>
                                     <ShareIcon className=' ml-3 h-6 w-6'/>
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                </>
            </div>
        </div>
    );

};

export default Trackholder;