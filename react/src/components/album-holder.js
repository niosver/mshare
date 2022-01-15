import React from 'react';
import Card from './card';

function Albumholder({albums}) {
    console.log(albums);
    function handleClick(event,album){

    }
    return(
        <div className='space-x-3 pl-10 w-auto'>
            <div className='flex justify-between pr-5'>
                <p className='text-white text-3xl font-semibold'>Albums</p>
                <p className='text-white text-lg self-end'>See All</p>
            </div>
            <div className='flex space-x-5 pt-5'>
                <>
                    {albums.items.map((album)=> (
                        <Card img={album.images[0]?album.images[0].url:require('../MissingAlbum.png')} title={album.name} body={album.artists[0]?album.artists[0].name:null} data={album}
                        handleClick={handleClick}/>
                    ))}
                </>
            </div>
        </div>
    );

};

export default Albumholder;