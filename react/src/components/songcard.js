import React,{useState} from "react";
import {millisToMinutesAndSeconds} from './time'
import {TrashIcon} from '@heroicons/react/outline';

function SongCard({num,data,handleClick,deletesong}) {
    const [hovering,SetHovering] = useState(false);
    const onMouseEnter = () => SetHovering(true);
    const onMouseLeave = () => SetHovering(false);
    return(
        <div className="w-screen hover:bg-stone-800 pt-5 pb-3">
            <div className="pl-10 pr-10 text-white grid grid-cols-6 gap-4 justify-items-start" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <div className='col-span-2'>
                        <div className='flex space-x-8 items-center'>
                            {hovering?<button className="" onClick={()=>deletesong(data)}>
                                <TrashIcon className="text-red-300 h-5 w-5"/>
                            </button>
                            :<p className='h-5 w-5'>{num+1}</p>
                            }
                            <button className="flex space-x-8 items-center" onClick={(e)=>handleClick(e,data)}>
                                <img className="h-12 w-12 rounded-lg shadow-2xl" src={data.track.album.images?data.track.album.images[0].url:require('../MissingAlbum.png')}/>
                                <div className="self-end w-[26rem]">
                                    <p className="text-lg truncate text-left">{data.track.name}</p>
                                    <p className="text-xs text-left truncate">{data.track.album.name}</p>
                                    <p className="text-xs text-left truncate">{data.track.artists[0].name}</p>
                                </div>
                            </button>
                            
                        </div>
                </div>

                <div className='self-center w-auto'>
                    <p className="truncate">{data.meta.sender}</p>
                </div>
                <div className='col-span-2 self-center'>
                    <p className="line-clamp-3">{data.meta.msg}</p>
                </div>
                <div className='self-center'>
                    <p>{millisToMinutesAndSeconds(data.meta.clipend-data.meta.clipstart)}</p>
                </div>
            </div>
            
        </div>
    );
}

export default SongCard;