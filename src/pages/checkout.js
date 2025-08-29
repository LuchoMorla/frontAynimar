import Head from 'next/head';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '@context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import CheckOrderItem from '@components/CheckoutOrderItem';
import actualizarImg from '@icons/button_refresh_15001.png';
import Tarjetas from '@common/paymentez/tarjetas/Tarjetas';
import CustomerProfile from "@containers/CustomerProfile";
import Client from '@components/Client';
import { useRouter } from 'next/router';
import Modal from '@common/Modal';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import endPoints from '@services/api';
import PaymentezDos from '@common/PaymentezDos';
import styles from '@styles/Checkout.module.scss';
import { toast } from 'react-toastify';
import { useAuth } from '@hooks/useAuth';
import { addCustomer } from '@services/api/entities/customers';

const Checkout = () => {
  const router = useRouter();
  const { state, clearCart } = useContext(AppContext);
  const auth = useAuth();

  const [email, setEmail] = useState('mail@vacio.com');
  const [open, setOpen] = useState(false);
  const refValidation = useRef(null);

  const [uId, setuId] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Función helper para obtener token (del código funcionando)
  const getCookieUser = () => {
    const token = Cookie.get('token');
    if (!token) {
      toast.error('Necesitas iniciar sesión');
      router.push('/login');
      return false;
    }
    return token;
  };

  // Función para obtener email desde la API (del código funcionando)
  const getUserEmail = async (id) => {
    try {
      const { data: fetch } = await axios.get(endPoints.users.getUser(id));
      const email = fetch.email;
      setEmail(email);
      console.log('Email obtenido de la API:', email);
    } catch (error) {
      console.error('Error al obtener email del usuario:', error);
      // Fallback: usar el email del auth si existe
      if (auth.user?.email) {
        setEmail(auth.user.email);
        console.log('Usando email del auth como fallback:', auth.user.email);
      }
    }
  };

  // UseEffect mejorado que combina ambos enfoques
  useEffect(() => {
    if (auth.user) {
      const token = getCookieUser();
      if (!token) return;
      
      try {
        const decodificado = jwt.decode(token, { complete: true });
        const userId = decodificado.payload.sub;
        setuId(userId);
        
        // Primero intentamos obtener el email de la API (más confiable)
        getUserEmail(userId);
        
        // Como fallback inmediato, usamos auth.user.email si existe
        if (auth.user.email) {
          setEmail(auth.user.email);
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        // Si hay problema con el token, usar solo el email del auth
        if (auth.user.email) {
          setEmail(auth.user.email);
        }
      }
    }
  }, [auth.user]);

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

  // Pega esta función dentro del componente Checkout en Checkout.js
const associateGuestCart = async () => {
    const token = Cookie.get('token');
    const guestOrderId = window.localStorage.getItem('oi');

    console.log('🔗 Verificando asociación de carrito:', { token: !!token, guestOrderId });

    if (token && guestOrderId) {
      try {
        console.log('🔗 Asociando carrito de invitado:', guestOrderId);
        await axios.patch(
          endPoints.orders.associateOrder,
          { orderId: parseInt(guestOrderId) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ Carrito de invitado #${guestOrderId} asociado con éxito.`);
        
        return true;
        
      } catch (error) {
        console.error('❌ Error al asociar el carrito de invitado:', error);
        return false;
      }
    }
    
    console.log('ℹ️ No hay carrito de invitado para asociar');
    return false;
};

  const handleGuestCheckout = async (event) => {
    event.preventDefault();
    toast.info('Registrando tu cuenta...');

    const formData = new FormData(event.target);

    const registrationData = {
      name: formData.get('name'),
      lastName: formData.get('apellido'),
      identityNumber: formData.get('cedula'),
      phone: formData.get('telfono1'),
      phoneTwo: formData.get('telfono2'),
      countryOfResidence: formData.get('pais'),
      province: formData.get('provincia'),
      city: formData.get('ciudad'),
      postalCode: formData.get('postal-code'),
      streetAddress: formData.get('direccion'),
      geolocation: formData.get('geolocation'),
      user: {
        email: formData.get('email-address'),
        password: formData.get('password')
      }
    };

    try {
      const response = await addCustomer(registrationData);

      if (response && response.auth) {
        toast.success('¡Registro exitoso! Iniciando sesión...');
        auth.manualSignIn(response.auth);
         // Usamos un pequeño delay para asegurar que la cookie del token se establezca correctamente
        setTimeout(async () => {
            console.log('Intentando asociar carrito después del registro...');
            await associateGuestCart();
        }, 200); // Un pequeño delay puede ayudar a asegurar que todo esté en su lugar
      } else {
        throw new Error('La respuesta del registro no fue la esperada.');
      }
    } catch (error) {
      console.error("Error en el registro del invitado:", error);
      if (error.response?.status === 409) {
        toast.error('El correo electrónico ya está registrado. Por favor, inicia sesión.');
      } else {
        toast.error('Hubo un error durante el registro.');
      }
    }
  };

  const openModalHandler = async (event) => {
    event.preventDefault();

    // Validaciones
    const formData = new FormData(refValidation.current);
    const termsAccepted = formData.get('termsAndConds') === 'on';
    if (!termsAccepted) {
      toast.error('Debes aceptar los términos y condiciones para continuar.');
      return;
    }
    if (state.cart.length === 0) {
      toast.error('No hay productos en el carrito');
      return;
    }

    // Verificar que el usuario está logueado
    if (!auth.user) {
      toast.error('Ocurrió un error. Por favor, refresca la página.');
      return;
    }

    // Verificar que tenemos email antes de continuar
    if (!email || email === 'mail@vacio.com') {
      toast.error('Error al obtener datos del usuario. Por favor, refresca la página.');
      console.error('Email no disponible:', email);
      return;
    }

    console.log('Datos para pago - Email:', email, 'UserId:', uId);

    if (paymentMethod === 'card') {
      setOpen(true);
    } else if (paymentMethod === 'cash') {
      try {
        toast.info('Procesando su pedido, por favor espere...');
        // const token = getCookieUser();
        // const decoded = jwt.decode(token, { complete: true });
        // const userId = decoded.payload.sub;

        // const payload = {
        //   userId: userId,
        //   items: state.cart.map((item) => ({
        //     productId: item.id,
        //     amount: item.OrderProduct.amount,
        //     price: item.price,
        //   })),
        //   total: parseFloat(valorTotalConIva.toFixed(2)),
        //   paymentMethod: 'contra_entrega',
        //   status: 'pendiente',
        // };

        const config = { headers: { 'Content-Type': 'application/json' } };
        const savedOrderId = window.localStorage.getItem('oi');
        const body = { state: 'pendiente_envio' };
        const response = await axios.patch(endPoints.orders.updateOrder(savedOrderId), body, config);
        
        if (response.status === 201 || response.status === 200) {
           window.localStorage.removeItem('oi');
           clearCart();
           toast.success("Tu pedido ha sido registrado con pago contra entrega.");
           router.push('/mi_cuenta/orders');
        }
      } catch (error) {
        console.error(error);
        toast.error('Hubo un error procesando tu pedido: ' + (error.response?.data?.message || 'Error desconocido'));
      }
    } else {    
      toast.error('Selecciona un método de pago antes de continuar.');
    }
  };

  const valorTotalSinIva = sumTotal();
  const valorTotalConIva = valorTotalSinIva * 1.15;

  return (
    <>
      <div>
        <Head>
          <title>Checkout | Aynimar</title>
        </Head>
        <div className={styles.Checkout}>
          <div className={styles['Checkout-container']}>
            <h1 className={styles.title}>
              {auth.user ? 'Finaliza tu Compra' : 'Regístrate para Continuar'}
            </h1>
            
            {auth.user ? (
              <CustomerProfile />
            ) : (
              <Client isGuest={true} onSubmit={handleGuestCheckout} />
            )}
           
            <div className={styles['Checkout-content']}>
              <div className={styles['my-orders']}>
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
                  <p><span>Total sin IVA</span></p>
                  <p>
                    ${valorTotalSinIva}{' '}
                    <button onClick={() => router.reload()} className={styles.reloadButton}>
                      <Image src={actualizarImg} alt='Actualizar | Update' width={20} height={20} />
                    </button>
                  </p>
                </div>
                <div className={styles.totalContainer}>
                  <p><span>Total con IVA</span></p>
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
            
            {auth.user && (
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
                    <button className={styles['pay-Button']} type="submit" onClick={() => setPaymentMethod('card')}>
                      Pagar con tarjeta de crédito o débito (Visa o Mastercard)
                    </button>
                    <button className={styles['pay-Button']} type="submit" onClick={() => setPaymentMethod('cash')}>
                      Pago a contra entrega
                    </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h1 className={styles.modaltitle}>Billetera de tarjetas de credito</h1>
        <Tarjetas userEmail={email} uId={uId} />
        <PaymentezDos userEmail={email} uId={uId} />
      </Modal>
    </>
  );
};

export default Checkout;