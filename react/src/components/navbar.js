import React,{useState} from 'react';
import {HomeIcon, SearchIcon, InboxIcon, UsersIcon,ChevronDownIcon,TrashIcon,LogoutIcon} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { Popover} from '@headlessui/react';
import axios from 'axios';
import Modal from './deletemodal';

function Navbar(props) {
    const navigate = useNavigate();
    const [open,SetOpen] = useState(false);
    function signout(){
        axios
            .post('/user/logout')
            .then(res => {
                if(res.status === 200) {
                    navigate('/login')
                }
                else {
                    //show error
                }
            })
            .catch(err => {
                //uh oh
            });
    }
    function deleteacc() {
        SetOpen(true);
    }
    function deleteaccforreal() {
        console.log('hehexd');
        SetOpen(false);
        axios
            .post('/user/delete')
            .then(res => {
                if(res.status === 200) {
                    navigate('/login')
                }
                else {
                    //show error
                }
            })
            .catch(err => {
                //uh oh
            });
    }
    return (
        <div className='text-gray-600 p-5 text-m border-r border-gray-900 overflow-y-scroll
            h-screen scrollbar-hide bg-black min-w-fit'>
            <Modal open={open} setOpen={SetOpen} deleteforreal={deleteaccforreal}/>
            <div className='space-y-2 w-32'>
                <button className='flex items-center space-x-2 hover:text-white' onClick={()=>navigate("/",{replace:false})}>
                    <HomeIcon className='h-5 w-5' />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white' onClick={()=>navigate("/search",{replace:false})}>
                    <SearchIcon className='h-5 w-5' />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white' onClick={()=>navigate("/social",{replace:false})}>
                    <UsersIcon className='h-5 w-5' />
                    <p>Social</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white' onClick={()=>navigate("/playlists",{replace:false})}>
                    <InboxIcon className='h-5 w-5' />
                    <p>Playlists</p>
                </button>
                <hr className='border-t-[0.2px] border-gray-900'/>
            </div>
            <div className='absolute top-5 right-5'>
                <Popover>
                    <Popover.Button>
                        <div className='bg-black rounded-full p-2 pr-3'>
                            <div className='flex items-center space-x-3'>
                                <img src={props.auth.user?props.auth.user.img_url:require('../MissingArtist.png')} alt="" className="rounded-full h-7 w-7"></img>
                                <p>{props.auth.user?props.auth.user.display_name:"Loading"}</p>
                                <ChevronDownIcon className='h-4 w-4'/>
                            </div>
                        </div>
                    </Popover.Button>
                    <Popover.Panel className=''>
                        <button className='flex space-x-2 bg-stone-700 text-white p-2 mt-3 rounded-t-lg hover:bg-stone-600 w-full'
                            onClick={()=>signout()}>
                            <LogoutIcon className='h-5 w-5 min-w-fit'/>
                            <p className='text-sm'>Sign out</p>
                        </button>
                        <button className='flex space-x-2 bg-stone-700 text-white p-2 rounded-b-lg hover:bg-stone-600 w-full'
                            onClick={()=>deleteacc()}>
                            <TrashIcon className='text-red-300 h-5 w-5 min-w-fit'/>
                            <p className='text-sm'>Delete account</p>
                        </button>
                    </Popover.Panel>
                </Popover>
            </div> 
        </div>
    );
}

export default Navbar;
