import React, { useState, useEffect, useContext, createContext } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import endPoints from '@services/api/';

export const defaultValue = {
  user: null,
  signIn: () => { },
  autoSignIn: () => { },
  recovery: () => { },
  changePassword: () => { },
  logout: () => { },
  getAuth: () => { }
};

const AuthContext = createContext(defaultValue);

export function ProviderAuth({ children }) {
  const auth = useProviderAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProviderAuth() {
  const [user, setUser] = useState(null);
  // --- INICIO DE LA MODIFICACIÓN ---
  // Este efecto se ejecuta una sola vez cuando el hook se carga por primera vez.
  useEffect(() => {
    // Función asíncrona para cargar el usuario desde la cookie.
    async function loadUserFromCookie() {
      const token = Cookie.get('token');
      if (token) {
        // Si hay un token, lo ponemos en las cabeceras para la siguiente petición.
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        try {
          // Hacemos la llamada al endpoint de perfil para obtener los datos del usuario.
          const { data: userData } = await axios.get(endPoints.auth.profile);
          // Si todo va bien, establecemos el usuario en el estado.
          setUser(userData);
        } catch (error) {
          // Si el token es inválido o expiró, la petición fallará.
          // Removemos la cookie rota y nos aseguramos de que el usuario sea null.
          console.error("Fallo al cargar la sesión desde la cookie", error);
          Cookie.remove('token');
          setUser(null);
        }
      }
    }
    loadUserFromCookie();
  }, []); // El array vacío asegura que solo se ejecute una vez.
  // --- FIN DE LA MODIFICACIÓN ---

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

  // --- INICIO DE LA NUEVA FUNCIÓN ---
  // Objetivo: Iniciar sesión manualmente cuando ya tenemos el token y los datos del usuario.
  const manualSignIn = (authData) => {
    console.log('sing')
    // authData será el objeto { user, token } que nos devuelve el AuthService
    if (authData && authData.token && authData.user) {
      const diasDisponiblesAntesDeCaducar = 30;
      const token = authData.token;
      Cookie.set('token', token, { expires: diasDisponiblesAntesDeCaducar });
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      const user = authData.user;
      setUser(user);
      console.log('✅ Sesión iniciada manualmente con éxito.');
    } else {
      console.error("manualSignIn falló: Faltan datos de autenticación.");
    }
  };
  // --- FIN DE LA NUEVA FUNCIÓN ---

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
    user: user,
    signIn: signIn,
    manualSignIn: manualSignIn, // --- AÑADIR ESTA LÍNEA ---
    autoSignIn: autoSignIn,
    recovery: recovery,
    changePassword: changePassword,
    logout: logout,
    getAuth: getAuth
  };
}