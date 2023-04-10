import '@styles/prueba.module.css'
import { Button } from 'primereact/button';
import React from 'react';

export default function PaymentezDos({ userEmail, uId }) {

  const [credencial, setCredencial] = React.useState({
    environment: 'stg',
    application_code: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE,
    application_key: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY,

  }
  )
  const RefButtonSubmit = React.useRef()
  const RefButtonRetry = React.useRef()
  const RefResponse = React.useRef()
  const [context, setContext] = React.useState()
  React.useEffect(() => {
    if (RefButtonSubmit.current != undefined) {
      setContext(RefButtonSubmit.current.textContent)
      start()
    }
  }, [RefButtonSubmit.current])
  async function start() {
    let get_tokenize_data = () => {
      let data = {
        locale: 'en',
        user: {
          id: uId,
          email: userEmail,
        },
        configuration: {
          default_country: 'COL'
        },
      }
      return data
    }

    let notCompletedFormCallback = message => {

      RefResponse.current.innerHTML = `Not completed form: ${message}, Please fill required data`;
      RefButtonSubmit.current.innerText = context;
      RefButtonSubmit.current.removeAttribute('disabled');
    }
    let responseCallback = response => {

      RefResponse.current.innerHTML = "Tarjeta Guardada con Exito";
      RefButtonSubmit.current.style.display = 'none';
      RefButtonRetry.current.style.display = 'block';
    }
    const esperaSdk = setInterval(() => {
      if (typeof PaymentGateway === 'function') {
        clearInterval(esperaSdk)

        let pg_sdk = new PaymentGateway(
          credencial.environment,
          credencial.application_code,
          credencial.application_key);

        pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);
        RefButtonSubmit.current.addEventListener('click', event => {
          RefResponse.current.innerHTML = '';
          RefButtonSubmit.current.innerText = 'Card Processing...';
          RefButtonSubmit.current.setAttribute('disabled', 'disabled');
          pg_sdk.tokenize();
          event.preventDefault();
        });
        RefButtonRetry.current.addEventListener('click', event => {
          RefButtonSubmit.current.innerText = context;
          RefButtonSubmit.current.removeAttribute('disabled');
          RefButtonRetry.current.style.display = 'none';
          RefButtonSubmit.current.style.display = 'block';
          pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);
        });
      }
    }, 1900)
  }


  return (
    <main className="container mb-5 d-flex justify-content-center">

      <div id='payment_example_div container'>
        <div id='tokenize_example'></div>
        <div id="response" ref={RefResponse}></div>
        <Button id='tokenize_btn' ref={RefButtonSubmit} class='tok_btn'>Save card</Button>
        <Button id='retry_btn' ref={RefButtonRetry} class='tok_btn container' display='none'>Save new card</Button>
      </div>

    </main>
  )
}