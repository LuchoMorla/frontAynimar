import { Button } from 'primereact/button';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import '@styles/prueba.module.scss';

export default function PaymentezDos({ userEmail, uId }) {
  const credencial = {
    environment: 'stg',
    application_code: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE,
    application_key: process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY,
  };

  const [saveCardText, setSaveCardText] = useState('Save Card');
  const [saveProcessing, setSaveProcessing] = useState(false);

  let pg_sdk = null;

  const get_tokenize_data = () => {
    return {
      locale: 'en',
      user: {
        id: uId,
        email: userEmail,
      },
      configuration: {
        default_country: 'COL',
      },
    };
  };

  const paymentForm = async () => {
    try {
      pg_sdk = new PaymentGateway(credencial.environment, credencial.application_code, credencial.application_key);
      await pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', onSuccess, onError);
    } catch (err) {
      console.log('PaymentForm Error: ', err);
    }
  };

  useEffect(() => {
    !saveProcessing && paymentForm();
  }, [saveProcessing]);

  const onSuccess = (response) => {
    if (response?.error) {
      toast.error(response.error?.type + '. \n' + response.error?.help);
    } else if (response?.card) {
      switch (response.card?.status) {
        case 'valid':
          toast.success('Tu tarjeta ha sido añadida con éxito');
          break;
        case 'pending':
          toast.warning('Tu tarjeta está pendiente ahora.');
          break;
        case 'rejected':
          toast.warning('No autorizado. Vuelva a intentarlo más tarde o con otra tarjeta');
          break;
        case 'review':
          toast.warning('El cargo está bajo revisión');
      }
    }
    setSaveProcessing(false);
    setSaveCardText('Save Card');
  };

  const onError = (message) => {
    console.log(`Not completed form: ${message}, Please fill required data`);
    setSaveProcessing(false);
    setSaveCardText('Save Card');
  };

  const handleSaveCard = async (event) => {
    event?.preventDefault();
    //toast.clear();
    setSaveCardText('Proceso...');
    setSaveProcessing(true);
    (await pg_sdk) && (await pg_sdk.tokenize());
  };

  return (
    <main className="container mb-5 d-flex justify-content-center">
      <div id="payment_example_div container">
        <div id="tokenize_example" className="Card" style={{ margin: 'auto', width: 'fit-content', padding: '20px 0px' }}>
          {' '}
        </div>
        <div className="w-fit mx-auto" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button id="tokenize_btn" className="w-[100%]" onClick={handleSaveCard} disabled={saveProcessing}>
            {saveCardText}
          </Button>
        </div>
      </div>
    </main>
  );
}

/*
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

*/
