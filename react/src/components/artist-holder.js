import React from 'react';
import Card from './card';


function albumholder({artists}) {
    console.log(artists);
    function handleClick(event,artist){
        
    }
    return(
        <div className='space-x-3 pl-10 w-auto'>
            <div className='flex justify-between pr-5'>
                <p className='text-white text-3xl font-semibold'>Artists</p>
                <p className='text-white text-lg self-end'>See All</p>
            </div>
            <div className='flex space-x-5 pt-5'>
                <>
                    {artists.items.map((artist)=> (
                        <Card img={artist.images[0]?artist.images[0].url:require('../MissingArtist.png')} title={artist.name} body={"Artist"} data={artist}
                        handleClick={handleClick}/>
                    ))}
                </>
            </div>
        </div>
    );

};

export default albumholder;