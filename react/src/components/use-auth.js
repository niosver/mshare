import axios from 'axios';
import React, {useState, useContext, createContext} from 'react';

const authContext = createContext();

export function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user,setUser] = useState(null);

    const signin = () => {
        axios
            .get('/user/me')
            .then(res => {
                if(res.status === 200) {
                    setUser(res.data);
                }
                else {
                    setUser(false);
                }
            })
            .catch(err => {
                console.log("login error: ", err);
                setUser(false);
            });
    };

    const signout = () => {

    };

    return {
        user,
        signin,
        signout
    };
}