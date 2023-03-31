import React, { /* useEffect, */ useState } from 'react';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from "next/router";
import axios from 'axios';
import endPoints from '@services/api';
import getAllCardsMetod from '../getAllCards(2)';/* 
import styles from '@styles/Paymentez.module.scss'; */

const Tarjetas = () => {/* 
    const codePaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE;
    const keyPaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY;
    let tarjetas = [];
    const [email, setEmail] = useState('vacio'); */
    const [uId, setuId] = useState(0);
    const router = useRouter(); 
  
    const getCookieUser = () => {
      const token = Cookie.get('token');
      if(!token){
        alert('necesitas iniciar session');
        router.push('/login');
      }/* 
      setuId(token); */
      return token;
   };
  
   const hiToken = getCookieUser();
   const decodificado = jwt.decode(hiToken, { complete: true });
   const userId = decodificado.payload.sub;
   setuId(userId);
  
    const getUserEmail = async (id) => {
      const { data: fetch } = await axios.get(endPoints.users.getUser(id)); 
      /* setEmail(fetch.email); */
      return fetch.email;
    }
    getUserEmail(uId);

    const lookTarjetasHandler = async () => {
        console.log('lookTarjetasHandler ah sido activado!!!');
    /*     const aynimarUserToken = getCookieUser();
        const decodificado = jwt.decode(aynimarUserToken, { complete: true });
        const uId = decodificado.payload.sub; */
        
        console.log('antes de declarar funcion');
        const getAllCards = async () => await getAllCardsMetod(uId);
    
    /*     console.log('antes de inicializar');
        console.log(getAllCards); */
        console.log('antes de inicializar2');
        const promiseOfGet = await getAllCards();/* 
        console.log(promiseOfGet.dataResponse); */
    /*     console.log('response looktarjetas');
        console.log(getAllCards.response); */
        console.log(promiseOfGet);
    
    /*     try { */
          /* const response = await axios.get(`https://ccapi-stg.paymentez.com/v2/card/list?uid=${uId}`); */
          console.log(response);
          console.log('Respuesta: tarjetas ', response.data);
          console.log(response.dataResponse);
    /*     } catch (error) {
          console.log('Error: ', error);
          console.log('Error: ', error.message);
        } */
      };

    return (
        <div>
            <button onClick={() => lookTarjetasHandler()}>ver tarjetas guardadas</button>
        </div>
    );
}

export default Tarjetas;