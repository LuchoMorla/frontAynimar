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

  const signIn = async (email, password) => {
    const options = {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    };
    const { data: access_token } = await axios.post(endPoints.auth.login, { email, password }, options);
    if (access_token) {
      const diasDisponiblesAntesDeCaducar = 15;
      Cookie.set('token', access_token.token, { expires: diasDisponiblesAntesDeCaducar });
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
      const diasDisponiblesAntesDeCaducar = 15;
      Cookie.set('token', access_token.token, { expires: diasDisponiblesAntesDeCaducar });
    }
  };

  const recovery = async (email) => {
    //
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
      const diasDisponiblesAntesDeCaducar = 3;
      Cookie.set('token', access_token.token, { expires: diasDisponiblesAntesDeCaducar });
    }
  };

      /* Implementación del Logout */
      const logout = async () => {
        Cookie.remove('token');
        setUser(null);
        delete axios.defaults.headers.Autorization;
        window.location.href = '/login';
      }


  return {
    user,
    signIn,
    autoSignIn,
    recovery,
    changePassword,
    logout
  };
}