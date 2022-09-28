import React, { useState, useContext, createContext } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import endPoints from '@services/api/';

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

  const getAuth = async () => {
      const token = Cookie.get('token');
      axios.defaults.headers.Authorization = `Bearer ${token}`;
  };

  const signIn = async (email, password) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const { data: access_token } = await axios.post(endPoints.auth.login, { email, password }, options);
    if (access_token) {
      const diasDisponiblesAntesDeCaducar = 30;
      const token = access_token.token;
      Cookie.set('token', token, { expires: diasDisponiblesAntesDeCaducar });
      // ya guardada la información en la cookie vamos a guardar la información en la aplicacion con su autorizacion
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      const user = access_token.user;
      setUser(user);
    }
  };

  const autoSignIn = async (token) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const { data: access_token } = await axios.post(endPoints.auth.autoLogin, { token }, options);
    if (access_token) {
      const diasDisponiblesAntesDeCaducar = 30;
      const token = access_token.token;
      Cookie.set('token', token, { expires: diasDisponiblesAntesDeCaducar });
      // ya guardada la información en la cookie vamos a guardar la información en la aplicacion con su autorizacion
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      const user = access_token.user;
      setUser(user);
    }
  };

  const recovery = async (email) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const recovering = await axios.post(endPoints.auth.recovery, { email }, options);
    return recovering;
  };

  const changePassword = async (token, newPassword) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const { data: access_token } = await axios.post(endPoints.auth.changePassword, { token, newPassword }, options);
    if (access_token) {
      const diasDisponiblesAntesDeCaducar = 30;
      const token = access_token.token;
      Cookie.set('token', token, { expires: diasDisponiblesAntesDeCaducar });
      // ya guardada la información en la cookie vamos a guardar la información en la aplicacion con su autorizacion
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      const user = access_token.user;
      setUser(user);
    }
  };

      /* Implementación del Logout */
      const logout = async () => {
        window.localStorage.removeItem('pi');
        window.localStorage.removeItem('oi');
        Cookie.remove('token');
        setUser(null);
        delete axios.defaults.headers.Autorization;
        window.location.href = '/login';
      };


  return {
    user,
    signIn,
    autoSignIn,
    recovery,
    changePassword,
    logout,
    getAuth
  };
}