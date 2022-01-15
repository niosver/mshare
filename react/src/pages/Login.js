import React from 'react';

function Login(){
    return (
        <div className='bg-stone-900 h-screen w-screen flex items-center justify-around'>
            <div className="bg-stone-700 p-10 rounded-lg pb-24 space-y-5">
                <div className="">
                    <img className="h-36" src={require("./Spotify_Logo_CMYK_Green.png")} alt="spotify logo"/>
                </div>
                <hr className='border-t-[0.4px] border-white'></hr>
                <div className="text-white flex items-center justify-around text-center">
                    <div className='space-y-5'>
                    <h5 className="text-lg">Spotify Login Required</h5>
                    <p className='text-white w-[36rem]'>
                        This is only a demo of a clip-based playlist collaboration addition to the Spotify 
                        platform so there will be undeveloped/disabled portions of this site. Namely the actual playing of
                        the clips is not currently implemented due to the Spotify Connect interface being premium only
                    </p>
                    <div className="flex justify-around">
                        <a href="/auth/login_spotify">
                        <button type="button" className="bg-black p-4 pl-7 pr-7 rounded-full" id="signin">Sign in</button>
                        </a>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;