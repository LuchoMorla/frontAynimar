import React, { useState, useContext, createContext } from "react";
import Cookie from "js-cookie";
import Axios from "axios";

const AuthContext = createContext();

export function ProviderAuth({ children }) {
    const auth = useProviderAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};

function useProviderAuth() {
    const [user, setUser] = useState(null);

    const signIn = async (email, password) => {
        setUser('Login');
/*         const response = await Axios.post(
            "http://localhost:5000/api/auth/signin",
            {
                email,
                password,
            }
        );
        const { user } = response.data;
        setUser(user);
        Cookie.set("token", user.token); */
    };

    return {
        user,
        signIn,
    };
}   

