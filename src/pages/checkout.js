import Head from 'next/head';
import React, { useContext, /* useEffect, */ useRef, useState } from 'react';
import AppContext from '@context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import CheckOrderItem from '@components/CheckoutOrderItem';
import actualizarImg from '@icons/button_refresh_15001.png';
import Paymentez from '@common/Paymentez'
/* import axios from 'axios'; */
/* import endPoints from '@services/api'; */
import { useRouter } from 'next/router';
import Modal from '@common/Modal'; /* 
import TPaymentez from '../paymentez/paymentez'; */
import styles from '@styles/Checkout.module.scss';

const Checkout = () => {
  const router = useRouter();

  const { state /* , toggleOrder */ } = useContext(AppContext);

  /* 	const actualizarSumTotal = useRef(null); */

  const [open, setOpen] = useState(false);

  const refValidation = useRef(null);

  // Paymentez
  /* useEffect(() =>
// Execute immediately
(function () {
  // === Variable to use ===
  let environment = 'stg';
  let application_code = 'APP-CODE-CLIENT';  // Provided by Payment Gateway
  let application_key = 'app_key_client';  // Provided by Payment Gateway
  let submitButton = document.querySelector('#tokenize_btn');
  let retryButton = document.querySelector('#retry_btn');
  let submitInitialText = submitButton.textContent;

  // Get the required additional data to tokenize card
  let get_tokenize_data = () => {
    let data = {
      locale: 'en',
      user: {
        id: String(Math.floor((new Date).getTime() / 1000)),
        email: 'jhon@doe.com',
      },
      configuration: {
        default_country: 'COL'
      },
    }
    return data
  }

  // === Required callbacks ===
  // Executed when was called 'tokenize' function but the form was not completed.
  let notCompletedFormCallback = message => {
    document.getElementById('response').innerHTML = `Not completed form: ${message}, Please fill required data`;
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
    document.getElementById('response').innerHTML = JSON.stringify(response);
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
    document.getElementById('response').innerHTML = '';
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

})(), []
)
 */
  // checkout
  const sumTotal = () => {
    const reducer = (accumalator, currentValue) => accumalator + currentValue.price * currentValue.OrderProduct['amount'];
    const sum = state.cart.reduce(reducer, 0);
    return sum.toFixed(2);
  };

  const openModalHandler = async (event) => {
    event.preventDefault();

    const contenido = {
      user: {
        id: '117',
        email: 'info@dbdturismo.com',
        name: 'Erick',
        last_name: 'Guillen',
      },
      order: {
        dev_reference: '1',
        description: 'Product test',
        amount: 1,
        taxable_amount: 0,
        tax_percentage: 0,
        vat: 0,
        installments_type: 0,
        currency: 'USD',
      },
      configuration: {
        partial_payment: true,
        expiration_days: 1,
        allowed_payment_methods: ['Card'],
        success_url: 'https://url-to-success.com',
        failure_url: 'https://url-to-failure.com',
        pending_url: 'https://url-to-pending.com',
        review_url: 'https://url-to-review.com',
      },
    };
/* 
    let sha256 = require('js-sha256');
    let paymentez_server_application_code = 'LINKTOPAY01-EC-SERVER';
    let paymentez_server_app_key = 'G8vwvaASAZHQgoVuF2eKZyZF5hJmvx';
    let unix_timestamp = String(Math.floor(new Date().getTime() / 1000));
    // unix_timestamp = String("1546543146");
    console.log('UNIX TIMESTAMP:', unix_timestamp);
    let uniq_token_string = paymentez_server_app_key + unix_timestamp;
    console.log('UNIQ STRING:', uniq_token_string);
    let uniq_token_hash = sha256(uniq_token_string);
    console.log('UNIQ STRING:', uniq_token_hash);
    let string_auth_token = btoa(paymentez_server_application_code + ';' + unix_timestamp + ';' + uniq_token_hash);
    console.log('AUTH TOKEN:', string_auth_token);

    axios.defaults.headers.uniq_token_string = uniq_token_string;
    axios.defaults.headers.unix_timestamp = unix_timestamp;
    axios.defaults.headers.uniq_token_hash = uniq_token_hash;
    axios.defaults.headers.string_auth_token = string_auth_token;

    const peticionApiPaymentez = await axios.post('https://noccapi-stg.paymentez.com/linktopay/init_order/', contenido);
    // respuesta paymentez
    console.log('peticionApiPaymentez ',peticionApiPaymentez); */

    const formData = new FormData(refValidation.current);
    const data = {
      terminosYCondiciones: formData.get('termsAndConds'),
    };

    let open = data.terminosYCondiciones == 'on' ? true : false;

    if (open == true) {
      setOpen(true);
      //Paymentez
      /*       paymentCheckout.open({
        reference: '8REV4qMyQP3w4xGmANU', // reference received for Payment Gateway
      }); */
    } else {
      alert('necesitas aceptar nuestros terminos y condiciones para proceder a pagar, haz click en el checkbox');
    }
  };

  let valorTotalSinIva = sumTotal();

  let valorTotalConIva = valorTotalSinIva * 1.12;

  return (
    <>
      <div>
        <Head>
          <title>Checkout | Aynimar</title>
        </Head>
        <div className={styles.Checkout}>
          <div className={styles['Checkout-container']}>
            <h1 className={styles.title}>Verificacion | Checkout</h1>
            <div className={styles['Checkout-content']}>
              <div /* ref={actualizarSumTotal} onChange={() => sumTotal()} */ className={styles['my-orders']}>
                {state.cart.map((product) => (
                  <CheckOrderItem product={product} key={`orderItem-${product.id}`} />
                ))}
              </div>
              <div className={styles.order}>
                <div className={styles.totalContainer}>
                  <p>
                    <span>Total sin IVA</span>
                  </p>
                  <p>
                    ${valorTotalSinIva}{' '}
                    <button onClick={() => router.reload()}>
                      <Image src={actualizarImg} width={20} height={20} />
                    </button>
                  </p>
                </div>
                <div className={styles.totalContainer}>
                  <p>
                    <span>Total con IVA</span>
                  </p>
                  <p>
                    ${valorTotalConIva.toFixed(2)}{' '}
                    <button onClick={() => router.reload()}>
                      <Image src={actualizarImg} width={20} height={20} />
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <form className={styles.paySubmitForm} ref={refValidation} onSubmit={openModalHandler}>
                <div className={styles['terminosyCondiciones-container']}>
                  <input type="checkbox" name="termsAndConds" id="termsAndConds" />
                  <p className={styles.termsAndCondsTextContent}>
                    he leído y acepto los{' '}
                    <Link href="/terminosYCondiciones" className={styles.termsAndCondLink}>
                      <p className={styles.termsAndCondLink}>términos y condiciones</p>
                    </Link>
                  </p>
                </div>
                <h3 className={styles.pagoTitle}>Proceder a pagar</h3>
                <button className={styles['pay-Button']} type="submit">
                  Pagar con tarjeta de credito o debito (Visa o Mastercard).
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* <p id="response"></p> */}
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h1>Form payment</h1>
        {/* <TPaymentez /> */}
{/*         <div id="payment_example_div">
          <div id="tokenize_example"></div>
          <div id="response"></div>
          <button id="tokenize_btn" className={styles["tok_btn"]}>
            Save card
          </button>
          <button id="retry_btn" className={styles["tok_btn"]} display="none">
            Save new card
          </button>
        </div> */}
        <Paymentez />
      </Modal>
    </>
  );
};

export default Checkout;
