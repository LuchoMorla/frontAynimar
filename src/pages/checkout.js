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

  const { state, clearCart /* , toggleOrder */ } = useContext(AppContext);

  /* 	const actualizarSumTotal = useRef(null); */
  const [email, setEmail] = useState('mail@vacio.com');
  const [open, setOpen] = useState(false);

  const refValidation = useRef(null);

  // Paymentez
  /*   let tarjetas = []; */
  const [uId, setuId] = useState(0);
  // Payment Metod state
  const [paymentMethod, setPaymentMethod] = useState('');

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
    try {
      const reducer = (accumalator, currentValue) => {
        if (currentValue.price && currentValue.OrderProduct && currentValue.OrderProduct.amount) {
          return accumalator + currentValue.price * currentValue.OrderProduct.amount;
        } else {
          return accumalator;
        }
      };
      const sum = state.cart.reduce(reducer, 0);
      return parseFloat(sum.toFixed(2));
    } catch (error) {
      console.error('Error al calcular el total:', error);
      return 0;
    }
  };

  /* const openModalHandler = async (event) => {
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
  }; */
    const openModalHandler = async (event) => {
    event.preventDefault();
    console.log('aqui lo estamos haciendo distinto');
    /* const data = {
      terminosYCondiciones: formData.get('termsAndConds'),
    };

    let open = data.terminosYCondiciones == 'on' ? true : false;

    if (open == true) {
      setOpen(true);
    } else {
      alert('necesitas aceptar nuestros terminos y condiciones para proceder a pagar, leelos y luego haz click en el checkbox');
    }; */
    console.log('para que le heches ojo el comentario copie y pegue');
    const formData = new FormData(refValidation.current);
    const termsAccepted = formData.get('termsAndConds') === 'on';
    console.log('se hace la misma validacion mejor identada');

    if (!termsAccepted) {
      console.log('los terminos y condiciones deben ser aceptados se activo');
      alert('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    console.log('paso la prueba la validacion');
    // Verificar que haya productos en el carrito
    console.group('ruben1');
    console.log('NO IF products in cart');
    if (state.cart.length === 0) {
      console.log('validacion si hay productos en el carrito se activo, este man para que la agrego?');
      alert('No hay productos en el carrito');
      return;
    }
    console.log('out if');
    console.groupEnd('ruben1');
 //Aqui es donde la logica comienza a ser otra
    console.log('donde la logica es otra comment');
    if (paymentMethod === 'card') {
      console.log('Abrimos Modal pago con tarjeta');
      setOpen(true); // Muestra modal con Tarjetas
    } else if (paymentMethod === 'cash') {
          console.log('Abrimos pago contra entrega');
      try {
        // Aquí llamas a tu backend para generar el pedido
        console.log('entramos al try Checkout pago contra entrega');
        const token = getCookieUser();
        const decoded = jwt.decode(token, { complete: true });
        const userId = decoded.payload.sub;

        console.log({token, decoded, userId});

        const payload = {
          userId: userId,
          items: state.cart.map((item) => ({
          productId: item.id,
          amount: item.OrderProduct.amount,
          price: item.price,
         })),
          total: parseFloat(valorTotalConIva.toFixed(2)),
          paymentMethod: 'contra_entrega', // importante para distinguir
          status: 'pendiente',
        };

        console.log('Datos pago contra entrega: ', payload);

        // Mostrar mensaje de procesamiento
        console.log('lampara del procesamiento');
        alert('Procesando su pedido, por favor espere...');
        const config = {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
        };
        // console.log('pago contra entrega?');
        // const response = await axios.post(endPoints.orders.postOrder, payload, config);

        //cambiojoseluis
        const savedOrderId = window.localStorage.getItem('oi');
          let body = {
            state: 'pendiente_envio',
          };
        const response = await axios.patch(endPoints.orders.updateOrder(savedOrderId), body, config);
        
        console.log('respuesta: ', response);
        console.log(response);
         if (response.status === 201 || response.status === 200) {
           // Limpiar el carrito y la orden local
           window.localStorage.removeItem('oi');
           console.log('aqui se esta limpiando el carrito, se esta usando una funcion crada por un programador mediocre');
           clearCart();
           console.log('se usó una funcion crada por un programador mediocre');
           console.log('se añade lo unico que se queria hacer en esta parte: lo de arriba de este bloque puede ser borrado despues de debuggearlo bien');
           alert("Tu pedido ha sido registrado con pago contra entrega.");
           router.push('mi_cuenta/orders');
         }
      } catch (error) {
        console.error(error);
        alert('Hubo un error procesando tu pedido: ' + (error.response?.data?.message || 'Error desconocido'));
      }
      console.log('cerramos catch pago contra entrega');
    } else {    
      console.log('Selecciona un método de pago antes de continuar. Error en el selec de uno de los dos botones');
      alert('Selecciona un método de pago antes de continuar.');
    }
  };
  console.log('comienza sumTotal, todo antes de aqui es tu culpa');

  let valorTotalSinIva = sumTotal();

  let valorTotalConIva = valorTotalSinIva * 1.15;

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
                {state.cart.length === 0 && (
                  <div className={styles.emptyCartWarning}>
                    <p>No hay productos en el carrito</p>
                  </div>
                )}
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
                  <button
                    className={styles['pay-Button']}
                    type="submit"
                    onClick={() => setPaymentMethod('card')}
                  >
                    Pagar con tarjeta de crédito o débito (Visa o Mastercard)
                  </button>

                  <button
                    className={styles['pay-Button']}
                    type="submit"
                    onClick={() => setPaymentMethod('cash')}
                  >
                    Pago a contra entrega
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