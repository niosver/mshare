import React from 'react';
// import '../App.css';
import useRequireAuth from '../components/use-require-auth';
import Navbar from '../components/navbar';
function Home(props){
    const auth = useRequireAuth();

    if(!auth) {
        return <div><h3>Loading</h3></div>
    }
    return (
        <div className='bg-black h-screen overflow-hidden'>
            <main className='flex items-start'>
                <Navbar auth={auth}/>
                <h3 className='text-white'>
                    Home
                </h3>
            </main>
        </div>
    );
}

export default Home;