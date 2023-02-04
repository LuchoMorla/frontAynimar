import Head from 'next/head';
import React, { useContext, useRef, useState } from 'react';
import AppContext from '@context/AppContext';
import CheckOrderItem from '@components/CheckoutOrderItem';
import Modal from '@common/Modal';/* 
import tPaymentez from '../paymentez/paymentez'; */
import styles from '@styles/Checkout.module.scss';

const Checkout = () => {
  const { state/* , toggleOrder */ } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const refValidation = useRef(null);

  // Paymentez
  /*   let paymentCheckout = new PaymentCheckout.modal({
    env_mode: 'local', // `prod`, `stg`, `local` to change environment. Default is `stg`
    onOpen: open,
    onClose: setOpen(),
    onResponse: function (response) {
      // The callback to invoke when the Checkout process is completed
      alert(`${JSON.stringify(response)}`); */
  /*
		In Case of an error, this will be the response.
		response = {
		  "error": {
			"type": "Server Error",
			"help": "Try Again Later",
			"description": "Sorry, there was a problem loading Checkout."
		  }
		}
		When the User completes all the Flow in the Checkout, this will be the response.
		response = {
		  "transaction":{
			  "status": "success", // success or failure
			  "id": "CB-81011", // transaction_id
			  "status_detail": 3 // for the status detail please refer to: https://paymentez.github.io/api-doc/#status-details
		  }
		}
	  */
  /* 			  console.log("modal response");
	  document.getElementById("response").innerHTML = JSON.stringify(response); */
  /*    },
  }); */

  // checkout
  const sumTotal = () => {
    const reducer = (accumalator, currentValue) => accumalator + currentValue.price;
    const sum = state.cart.reduce(reducer, 0);
    return sum.toFixed(2);
  };

  const openModalHandler = (event) => {
    event.preventDefault();
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
              <div className={styles['my-orders']}>
                {state.cart.map((product) => (
                  <CheckOrderItem product={product} key={`orderItem-${product.id}`} />
                ))}
              </div>
              <div className={styles.order}>
                <p>
                  <span>Total</span>
                </p>
                <p>${sumTotal()}</p>
              </div>
            </div>
            <div>
              <form ref={refValidation} onSubmit={openModalHandler}>
                <div className={styles['terminosyCondiciones-container']}>
                  <input type="checkbox" name="termsAndConds" id="termsAndConds" />
                  <p>he leído y acepto los terminos y condiciones</p>
                </div>
                <h3>Proceder a pagar</h3>
                <button type="submit">Pagar con cualquier tarjeta de credito o debito (Visa o Mastercard).</button>
              </form>
            </div>
          </div>
        </div>
        <p id="response"></p>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h1>Form payment</h1>
        {/* <tPaymentez /> */}
      </Modal>
    </>
  );
};

export default Checkout;
