import React, {useState} from 'react';
import {ClockIcon,ChevronLeftIcon} from '@heroicons/react/outline';
import SongCard from './songcard';
import { Popover} from '@headlessui/react';
import { DotsHorizontalIcon,UserGroupIcon,TrashIcon } from '@heroicons/react/outline'
import { usePopper } from 'react-popper';

function PlaylistPage({playlist,deletesong,back,delete_playlist,openConfig}) {
    console.log(playlist)
    const [refElement,setRefElement] = useState()
    const [popperEle,setPopperEle] = useState()
    const {styles,attributes} = usePopper(refElement,popperEle)
    function playsong(event,data){

    }
    return(
        <div className='w-screen'>
            <div className='p-10 pb-0'>
            <button className='flex text-white' onClick={()=>back()}>
                    <div className='bg-black rounded-full p-1'>
                        <ChevronLeftIcon className='h-6 w-6'/>
                    </div>
            </button>
            </div>
            <div className='flex p-10 items-center pb-2'>
                <img className=' h-64 w-64 object-cover' alt="album art" src={require('../MissingAlbum.png')}/>
                <div className='p-5 pr-96 self-end pb-0'>
                    <p className='text-white text-7xl line-clamp-2 pb-3'>{playlist.playlistdata?playlist.playlistdata.name:'null'}</p>
                    <p className=' text-white'>Contributers: </p>
                    <p className='text-white text-sm truncate pr-96'>{playlist.playlistdata?playlist.playlistdata.contributers:'null'}</p>
                </div>
            </div>
            <div className='pl-10'>
                <Popover>
                    <Popover.Button ref={setRefElement}>
                        <DotsHorizontalIcon className='h-10 w-10 text-white'/>
                    </Popover.Button>
                    <Popover.Panel className='' ref={setPopperEle} style={styles.popper} {...attributes.popper}>
                        <button className='flex space-x-2 bg-stone-700 text-white p-2 mt-3 rounded-t-lg hover:bg-stone-700 w-full'
                            onClick={()=>openConfig(true)}>
                            <UserGroupIcon className='h-5 w-5 min-w-fit'/>
                            <p className='text-sm'>Change Contributers</p>
                        </button>
                        <button className='flex space-x-2 bg-stone-700 text-white p-2 rounded-b-lg hover:bg-stone-700 w-full'
                            onClick={()=>delete_playlist(playlist)}>
                            <TrashIcon className='text-red-300 h-5 w-5 min-w-fit'/>
                            <p className='text-sm'>Delete playlist</p>
                        </button>
                    </Popover.Panel>
                </Popover>
            </div>
            <div className='pl-10 pr-10 text-white grid grid-cols-6 gap-4 pb-2'>
                <div className='col-span-2'>
                    <div className='flex space-x-10 pl-1'>
                        <p className=''>#</p>
                        <p className='pl-1'>Title</p>
                    </div>
                </div>
                <div className=''>
                    <p>Sender</p>
                </div>
                <div className='col-span-2'>
                    <p>Message</p>
                </div>
                <div className=''>
                    <ClockIcon className='h-5 w-5 ml-1'/>
                </div>
            </div>
            <hr className='border-t-[0.8px] border-white w-auto'></hr>
            <>
                {
                playlist.tracks.map((song,i)=> (
                    <SongCard num={i} data={song} handleClick={playsong} deletesong={deletesong}/>
                ))}
            </>
        </div>
    );
}

export default PlaylistPage;