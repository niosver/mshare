import React, {useState, useEffect} from 'react';
import useRequireAuth from '../components/use-require-auth';
import Navbar from '../components/navbar';
import Searchbar from '../components/searchbar';
import Friendholder from '../components/friend-holder';
import axios from 'axios';
import querystring from 'querystring';

function Relationships(props) {
    const auth = useRequireAuth();
    const [input,setInput] = useState('');
    const [users,setUsers] = useState(null);
    const [friends,setFriends] = useState(null);
    const [update,triggerUpdate] = useState(null);

    function handleSearch(event) {
        const search = event.target.value;
        console.log(search)
        setInput(search);
    }
    useEffect(() => {
        if(input != '') {
            setFriends(null);
        }
        else {
            axios
            .get('/search/friends')
            .then(res => {
                console.log(res);
                if(res.status === 200 && res.data.length) {
                    setFriends(res.data);
                }
                else {
                    setFriends(null);
                }
            })
            .catch(err => {
                console.log("login error: ", err);
                setFriends(null);
            });
        }
    },[input,update])

    useEffect(()=>{
        if(!input) {
            setUsers(null);
        }
        else {
            axios
        .get('/search/users?'+
            querystring.stringify({
                q: input
            })
        )
        .then(res => {
            console.log(res);
            if(res.status === 200) {
                setUsers(res.data);
            }
            else {
                setUsers(null);
            }
        })
        .catch(err => {
            console.log("login error: ", err);
            setUsers(null);
        });
        }
    },[input,update])

    function handleSubmit(event) {
        event.preventDefault();
    };
    if(!auth) {
        return <div><h3>Loading</h3></div>
    }
    return (
        <div className='h-screen x-screen overflow-hidden bg-stone-900'>
            <main className='flex items-start'>
                <Navbar auth={auth}/>
                <div className='h-screen overflow-y-scroll scrollbar-hide'>
                    <Searchbar search={input} setSearch={handleSearch} handleSubmit={handleSubmit}/>
                    <div className='p-2 space-y-5'>
                        {
                            friends?<Friendholder users={friends} banner={"Relationships"} update={triggerUpdate}/>:
                                users?<Friendholder users={users} banner={"Users"} update={triggerUpdate}/>:null
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Relationships;