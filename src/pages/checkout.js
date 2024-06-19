import Head from 'next/head';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '@context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import CheckOrderItem from '@components/CheckoutOrderItem';
import actualizarImg from '@icons/button_refresh_15001.png';
import Tarjetas from '@common/paymentez/tarjetas/Tarjetas';
import CustomerProfile from "@containers/CustomerProfile";
import { useRouter } from 'next/router';
import Modal from '@common/Modal';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import endPoints from '@services/api';
import PaymentezDos from '@common/PaymentezDos';/* 
import DiscountCodeInput from '@components/DiscountCodeInput'; */
import styles from '@styles/Checkout.module.scss';

const Checkout = () => {
  const router = useRouter();

  const { state /* , toggleOrder */ } = useContext(AppContext);

  /* 	const actualizarSumTotal = useRef(null); */
  const [email, setEmail] = useState('mail@vacio.com');
  const [open, setOpen] = useState(false);

  const refValidation = useRef(null);

  // Paymentez
  /*   let tarjetas = []; */
  const [uId, setuId] = useState(0);

  const getCookieUser = () => {
    const token = Cookie.get('token');

    if (!token) {
      alert('necesitas iniciar session');
      router.push('/login');
      return false;
    }
    return token;
  };

  useEffect(() => {

    const hiToken = getCookieUser();
    if (!hiToken) return;
    const decodificado = jwt.decode(hiToken, { complete: true });
    const userId = decodificado.payload.sub;

    setuId(userId);
    const getUserEmail = async (id) => {
      const { data: fetch } = await axios.get(endPoints.users.getUser(id));
      const email = fetch.email;
      setEmail(email);
    };
    getUserEmail(userId);
  }, []);

  // checkout
  const sumTotal = () => {
    //const reducer = (accumalator, currentValue) => accumalator + currentValue.price * currentValue.OrderProduct['amount'];
    const reducer = (accumalator, currentValue) => {
      if (currentValue.price && currentValue.OrderProduct && currentValue.OrderProduct.amount) {
        return accumalator + currentValue.price * currentValue.OrderProduct.amount;
      } else {
        return accumalator;
      }
    };
    const sum = state.cart.reduce(reducer, 0);
    return sum.toFixed(2);
  };

  const openModalHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(refValidation.current);
    const data = {
      terminosYCondiciones: formData.get('termsAndConds'),
    };

    let open = data.terminosYCondiciones == 'on' ? true : false;

    if (open == true) {
      setOpen(true);
    } else {
      alert('necesitas aceptar nuestros terminos y condiciones para proceder a pagar, leelos y luego haz click en el checkbox');
    };
  };

  let valorTotalSinIva = sumTotal();

  let valorTotalConIva = valorTotalSinIva * 1.14;

 /*  function autoReload() {
    setInterval(() => {
      // Aquí puedes poner tu condición para verificar si se debe realizar la recarga
      const condicion = state?.cart?.map();
      if (condicion) {
        location.reload(); // Recarga la página
      }
    }, 5000); // Intervalo de tiempo en milisegundos (en este caso, cada 5 segundos)
  }
  
  // Llama a la función para iniciar el autorecarga
  autoReload(); */

  return (
    <>
      <div>
        <Head>
          <title>Checkout | Aynimar</title>
        </Head>
        <div className={styles.Checkout}>
          <div className={styles['Checkout-container']}>
            <h1 className={styles.title}>Checkout</h1>
            {/* <div> */}
              <CustomerProfile />   
           {/*  </div> */}
            <div className={styles['Checkout-content']}>
            {/* // buen lugar para agregar descuentosS 
              <DiscountCodeInput />*/}
              <div /* ref={actualizarSumTotal} onChange={() => sumTotal()} */ className={styles['my-orders']}>
                <table>
                  <tbody>
                    {state?.cart?.map((product) => (
                      <CheckOrderItem product={product} key={`orderItem-${product?.id}`} />
                    ))}
                  </tbody>
                </table>

              </div>
              <div className={styles.order}>
                <div className={styles.totalContainer}>
                  <p>
                    <span>Total sin IVA</span>
                  </p>
                  <p>
                    ${valorTotalSinIva}{' '}
                    <button onClick={() => router.reload()} className={styles.reloadButton}>
                      <Image src={actualizarImg} alt='Actualizar | Update' width={20} height={20} />
                    </button>
                  </p>
                </div>
                <div className={styles.totalContainer}>
                  <p>
                    <span>Total con IVA</span>
                  </p>
                  <p>
                    ${valorTotalConIva.toFixed(2)}{' '}
                    <button onClick={() => router.reload()} className={styles.reloadButton}>
                      <Image src={actualizarImg} alt='Actualizar | Update' width={20} height={20} />
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
                    he leído y acepto los
                  </p>
                  <Link href="/terminosYCondiciones" className={styles.termsAndCondLink} passHref>
                    <p className={styles.termsAndCondLink}>términos y condiciones</p>
                  </Link>
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
        <h1 className={styles.modaltitle} >Billetera de tarjetas de credito</h1>
        <Tarjetas userEmail={email} uId={uId} />
        <PaymentezDos userEmail={email} uId={uId} />
      </Modal>
    </>
  );
};

export default Checkout;



/*     const contenido = {
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
        }; */