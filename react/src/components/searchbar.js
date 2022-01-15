import React from 'react';
import {SearchIcon,ChevronLeftIcon} from "@heroicons/react/outline";
import { useNavigate } from 'react-router-dom';

const Searchbar = ({search,setSearch,handleSubmit}) =>{
    const navigate = useNavigate();
    return(
        <header className='p-5 flex space-x-4 items-center'>
            <button className='flex text-white' onClick={()=>{navigate(-1)}}>
                    <div className='bg-black rounded-full p-1'>
                        <ChevronLeftIcon className='h-6 w-6'/>
                    </div>
            </button>
            <div className='flex rounded-full bg-white pr-4 p-1'>
                <SearchIcon className='h-7 w-7'/>
                <input type="search" className="focus:outline-none" placeholder="Search..." aria-label="Search"
                    value= {search} onChange={(e) => setSearch(e)} onSubmit={(e) => handleSubmit(e)}/>
            </div>
        </header>
    );
}

export default Searchbar;
