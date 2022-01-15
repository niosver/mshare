import React from "react";

function Card({img,title,body,data,handleClick}) {
    return(
        <button onClick={(e)=>handleClick(e,data)} className="self-end">
            <div className='bg-stone-800 rounded-sm p-4 pb-5 hover:bg-stone-700 w-48'>
                <div>
                    <div className="flex justify-around">
                        <img className='h-36 rounded-full' src={img} alt="album/artist art"/>
                    </div>
                    
                    <div className='mt-4 text-left'>
                        <p className='text-white text-lg truncate font-semibold'>{title}</p>
                        <p className='text-white text-sm truncate'>{body}</p>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default Card;