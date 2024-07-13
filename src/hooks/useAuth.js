import React, { useState, useContext, createContext, useEffect } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import endPoints from '@services/api/';

const AuthContext = createContext();

export function ProviderAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(endPoints.auth.login, { email, password }, options);
    /*     console.log(access_token); */
    if (data) {
      /*         const diasDisponiblesAntesDeCaducar = 3;
              Cookie.set('token', access_token.access_token, { expires: diasDisponiblesAntesDeCaducar }); */
      const { token, user } = data;
      Cookie.set('token', token, { expires: 5 });
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      setUser({
        id: user.id,
        role: user.role
      });
    }
  };

  /* Implementación del Logout */
  const logout = async () => {
    Cookie.remove('token');
    setUser(null);
    delete axios.defaults.headers.Autorization;
    window.location.href = '/login';
  }

  const signUpBusinessOwner = async (body) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };

    await axios.post(endPoints.businessOwner.create, {
      ...body.businessOwner,
      user: body.user,
    }, options);

    await signIn(body.user.email, body.user.password);
  };

  const signUp = async (body) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };

    await axios.post(endPoints.users.create, body, options);
    await signIn(body.user.email, body.user.password);
  };

  const autoLogin = async (token) => {
    axios.defaults.headers.Authorization = `Bearer ${token}`;
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const { data: profile } = await axios.get(endPoints.auth.profile, { token }, options);
    setUser({
      id: profile.sub,
      role: profile.role
    });
  }

  const checkUser = () => {
    const token = Cookie.get("token");

    if (token) {
      autoLogin(token);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return {
    user,
    signIn,
    logout,
    signUpBusinessOwner,
    signUp,
  };
}
