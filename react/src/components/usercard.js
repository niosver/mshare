import React from "react";
import {UserRemoveIcon,UserAddIcon,UserGroupIcon} from '@heroicons/react/outline';

function Usercard({img,name,status,data,addFriend,removeFriend,addFollow,removeFollow}) {
    var default_status = "none";
    console.log(status);
    console.log(data);
    return(
        <div className="flex justify-between items-center bg-black p-2 rounded-lg w-auto mt-5 ml-5 min-w-fit">
            <img src={img} alt="user profile picture" className="h-10 w-10"/>
            <div className="text-white overflow-hidden flex ml-3 mr-3 min-w-0 items-center">
                <p className="font-semibold truncate">{name}</p>
                <p className=" text-neutral-500 pl-1 pr-1 text-sm">{status?status:default_status}</p>
            </div>
            {status=="none"||(status=="pending"&&data.orig==data.uuid)||!status?
                    <button onClick={(e)=>addFriend(e,data)}>
                    <UserAddIcon className="h-5 w-5 text-green-600 min-w-fit pl-1"/>
                    </button>
                :
                    <button onClick={(e)=>removeFriend(e,data)}>
                    <UserRemoveIcon className="h-5 w-5 text-red-600 min-w-fit pl-1"/>
                    </button>
            }
            {console.log(data)}
            {data.following=="true"?
                    <button onClick={(e)=>removeFollow(e,data)}>
                    <UserGroupIcon className="h-5 w-5 text-red-600 min-w-fit pl-1"/>
                    </button>
                :
                    <button onClick={(e)=>addFollow(e,data)}>
                    <UserGroupIcon className="h-5 w-5 text-green-600 min-w-fit pl-1"/>
                    </button>
            }
        </div>
        
    );
}

export default Usercard;