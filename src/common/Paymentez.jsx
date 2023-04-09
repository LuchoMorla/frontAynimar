import React, { useEffect/* , useState  */, useRef } from 'react';

import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from "next/router";/* 
import axios from 'axios';
import endPoints from '@services/api'; 
import getAllCardsMetod from './paymentez/getAllCards(2)'; */
import styles from '@styles/Paymentez.module.scss';

const Paymentez = ({ userEmail }) => {
  console.log('entramos a paymentes y el userEmail es: ', userEmail);
  const codePaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE;
  const keyPaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY;
/*   let tarjetas = []; */
  /*  const [email, setEmail] = useState('mail@vacio.com'); */
/*  const [uId, setuId] = useState(0); */
   const router = useRouter(); 

  const getCookieUser = () => {
    const token = Cookie.get('token');
    if(!token){
      alert('necesitas iniciar session');
      router.push('/login');
    } /* 
    setuId(token);*/
    return token;
 };



 /* const hiToken = getCookieUser();
 const decodificado = jwt.decode(hiToken, { complete: true });
 const userId = decodificado.payload.sub;
 setuId(userId); */
/*  const paymentez = () => { */
  setTimeout(
    (function () {

/*       const       response = useRef(null),
      tokenize_btn = useRef(null),
      retry_btn = useRef(null); */
/*       payment_example_div = useRef(null),
      tokenize_example = useRef(null),
      response = useRef(null),
      tokenize_btn = useRef(null),
      retry_btn = useRef(null); */
/* 
      let submitButton = tokenize_btn;
      let retryButton = retry_btn;
      let submitInitialText = submitButton.textContent;      */

      // const hiToken = getCookieUser();
      // const decodificado = jwt.decode(hiToken, { complete: true });
      // const userId = decodificado.payload.sub;
      // === Variable to use ===
      let environment = 'stg';
      let application_code = codePaymentezNuvei;  // Provided by Payment Gateway
      let application_key = keyPaymentezNuvei;  // Provided by Payment Gateway
      let submitButton = document.querySelector('#tokenize_btn');
      let retryButton = document.querySelector('#retry_btn');
      let submitInitialText = submitButton.textContent;
    
      // Get the required additional data to tokenize card
      let get_tokenize_data = () => {
  /*       const aynimarUserToken = getCookieUser();
        const decodificado = jwt.decode(aynimarUserToken, { complete: true });
        const uId = decodificado.payload.sub; */
    
         let data = {
          locale: 'en',
          user: {
            id: userId,
            email: userEmail,
          },
          configuration: {
            default_country: 'USD', //tipo de moneda: 'COL'
          },
        }
        console.log('console.log del corregido mio', data);
        /* 
        const diasDisponiblesAntesDeCaducar = 1;
        Cookie.set('NuveiP', data, { expires: diasDisponiblesAntesDeCaducar }); */
        return data;
      }
    
      // === Required callbacks ===
      // Executed when was called 'tokenize' function but the form was not completed.
      let notCompletedFormCallback = message => {
        response.innerHTML = `Not completed form: ${message}, Please fill required data`;
        submitButton.innerText = submitInitialText;
        submitButton.removeAttribute('disabled');
      }
    
      // Executed when was called 'tokenize' and the services response successfully.
      let responseCallback = response => {
        // Example of success tokenization.
        //   {
        //    "card": {
        //     "bin": "411111",
        //     "status": "valid",
        //     "token": "2508629432271853872",
        //     "message": "",
        //     "expiry_year": "2033",
        //     "expiry_month": "12",
        //     "transaction_reference": "RB-143809",
        //     "type": "vi",
        //     "number": "1111"
        //   }
        // }
    
        // Example of failed tokenization. The error format is always the same, only the value of type, help, description changes.
        // {
        //    "error": {
        //       "type": "Card already added: 2508629432271853872",
        //       "help": "If you want to update the card, first delete it",
        //       "description": "{}"
        //    }
        // }
        response.innerHTML = JSON.stringify(response);
        retryButton.style.display = 'block';
        submitButton.style.display = 'none';
      }
    
      // 2. Instance the [PaymentGateway](#PaymentGateway-class) with the required parameters.
      let pg_sdk = new PaymentGateway(environment, application_code, application_key);
    
      // 3. Generate the tokenization form with the required data. [generate_tokenize](#generate_tokenize-function)
      // At this point it's when the form is rendered on page.
      pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);
    
      // 4. Define the event to execute the [tokenize](#tokenize-function) action.
      submitButton.addEventListener('click', event => {
        response.innerHTML = '';
        submitButton.innerText = 'Card Processing...';
        submitButton.setAttribute('disabled', 'disabled');
        pg_sdk.tokenize();
        event.preventDefault();
      });
      // };
    
      // You can define a button to create a new form and save new card
      retryButton.addEventListener('click', event => {
        // re call function
        submitButton.innerText = submitInitialText;
        submitButton.removeAttribute('disabled');
        retryButton.style.display = 'none';
        submitButton.style.display = 'block';
        pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);
      });
    
      //bloque de authorizacio  y cracion del toquen
      let sha256 = require('js-sha256');
    let paymentez_server_application_code = codePaymentezNuvei;//'Application Code Server';
    let paymentez_server_app_key = keyPaymentezNuvei;//'Application Key Server';
    let unix_timestamp = String(Math.floor(new Date().getTime() / 1000));
    // unix_timestamp = String("1546543146"); 
    /* console.log("UNIX TIMESTAMP:", unix_timestamp); */
    let uniq_token_string = paymentez_server_app_key + unix_timestamp;
    /* console.log('UNIQ STRING:', uniq_token_string); */
    let uniq_token_hash = sha256(uniq_token_string);
  /*   console.log('UNIQ STRING:', uniq_token_hash); */
    let string_auth_token = btoa(paymentez_server_application_code + ";" + unix_timestamp + ";" + uniq_token_hash);
   /*  console.log('AUTH TOKEN:', string_auth_token); */
    /* const diasDisponiblesAntesDeCaducar = 1;
    Cookie.set('AUTH TOKEN', string_auth_token, { expires: diasDisponiblesAntesDeCaducar }); */
    
    })(), 10000
  );
/*  } */

/*   const getUserEmail = async (id) => {
    const { data: fetch } = await axios.get(endPoints.users.getUser(id)); 
    setEmail(fetch.email);
    return fetch.email;
  }
  const getingEmail = getUserEmail(userId);
  console.log(getingEmail);
  if(getingEmail == email) {
    console.log(email);
    paymentez();
  }
 */

  /* useEffect(  */   // Execute immediately
  
  /* , []) */
/* 
  hiPaymentez(); *//* 
  useEffect(()=> hiPaymentez()); */

    return (
        <>
        <div ref={payment_example_div} id="payment_example_div">
{/*           <div>
            {tarjetas.length > 0 ? <ul>
              <li></li>
            </ul>
            :
            null}
          </div> */}
          <div ref={tokenize_example} id="tokenize_example" ></div>
          <div ref={response} id="response"  ></div>
          <button ref={tokenize_btn} id="tokenize_btn" className={styles["tok_btn"]}>
            Guardar Tarjeta
          </button>
          <button ref={retry_btn} id="retry_btn" className={styles["tok_btn"]} display="none">
            Agregar nueva tarjeta
          </button> 
{/*           <div>
            <button onClick={() => lookTarjetasHandler()}>ver tarjetas guardadas</button>
          </div> */}
        </div>
        </>
    );
}
export default Paymentez;