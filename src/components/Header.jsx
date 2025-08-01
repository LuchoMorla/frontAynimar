import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '@components/Menu';
import NavMenu from '@components/NavMenu';
import MyOrder from '@containers/MyOrder';
import MyPayment from '@containers/MyPayment';
import Cookie from 'js-cookie';
import menu from '@icons/icon_menu.svg';
import logo from '@logos/logoAynimar.svg';
import AppContext from '@context/AppContext';
import shoppingCart from '@icons/icon_shopping_cart.svg';
import sellingCart from '@icons/reciclando.svg';
import userIcon from '@icons/user-icon-ecologist.svg';
import endPoints from '@services/api/index';
import axios from 'axios';
import styles from '@styles/Header.module.scss';
import TestContext from '@context/TestContext';

const Header = () => {
  // NOTA: La lógica de `useAuth`, `token` y `setToken` parece causar re-renders.
  // Es mejor manejar la validación del token de forma más directa dentro de useEffect o con una función simple.
  // He mantenido tu código, pero considera refactorizar esto en el futuro.
  const [token, setToken] = useState(null);
  const orderState = useContext(TestContext);
  const auth = useAuth(); // Renombrado de 'hola' a 'auth' para mayor claridad
  if (!token) {
    auth.getAuth();
    setToken('haveToken');
  }

  const { state, getCart, toggleOrder, toggleMenu, togglePayment, toggleNavMenu } = useContext(AppContext);

  // Función simple y clara para verificar si existe la cookie del token.
  const isUserAuthenticated = () => {
    return !!Cookie.get('token');
  };


  // --- NUEVA LÓGICA DE CARGA DE DATOS ---
  useEffect(() => {
    const userHasToken = isUserAuthenticated();
    const guestOrderId = window.localStorage.getItem('oi');

    const fetchCartData = async () => {
      // Si el carrito en el estado de React ya tiene items, no hacemos nada.
      if (state.cart.length > 0) {
        return;
      }

      let orderData = null;

      try {
        if (userHasToken) {
          // --- FLUJO PARA USUARIO LOGUEADO ---
          console.log('Usuario autenticado. Buscando orden de "carrito"...');
          // Hacemos la llamada dentro de un try/catch por si el usuario no tiene carrito activo.
          try {
            const { data } = await axios.get(endPoints.orders.getOrderByState, { params: { state: 'carrito' } });
            orderData = data;
          } catch (error) {
            // Es un caso normal que no haya un carrito, no es un error crítico.
            console.log('El usuario autenticado no tiene una orden de tipo "carrito" activa.');
          }

        } else if (guestOrderId) {
          // --- FLUJO PARA INVITADO ---
          console.log(`Usuario invitado. Buscando orden de carrito #${guestOrderId}...`);
          const { data } = await axios.get(endPoints.orders.getGuestOrder(guestOrderId));
          orderData = data;
        }

        // Si se encontró una orden (de cualquier tipo), se procesa.
        if (orderData && orderData.items && orderData.items.length > 0) {
          console.log('Orden encontrada, poblando el estado del carrito con:', orderData.items);
          
          // Llenamos el carrito en el Contexto Principal
          getCart(orderData.items);
          
          // Actualizamos el otro contexto si es necesario
          if (orderState && orderState.setOrder) {
            orderState.setOrder(orderData);
          }

          // Nos aseguramos de que el ID de la orden esté en localStorage
          if (!window.localStorage.getItem('oi')) {
            window.localStorage.setItem('oi', `${orderData.id}`);
          }
        }
      } catch (error) {
        console.error('Error al intentar cargar los datos del carrito:', error);
        
        // Si el error es 404 (Not Found) o 403 (Forbidden) para una orden de invitado,
        // significa que la orden ya no es válida (quizás ya se compró o asoció).
        // La limpiamos del localStorage para evitar futuras llamadas fallidas.
        if (guestOrderId && !userHasToken && error.response && (error.response.status === 404 || error.response.status === 403)) {
          console.log(`La orden de invitado #${guestOrderId} no es válida. Limpiando localStorage.`);
          window.localStorage.removeItem('oi');
        }
      }
    };

    fetchCartData();

    // Este efecto se ejecutará solo una vez cuando el componente se monte,
    // o si el estado del carrito cambia (por ejemplo, si se vacía).
    // Esto evita llamadas innecesarias a la API en cada re-render.
  }, [state.cart.length]);


  return (
    <>
      <nav className={styles.Nav}>
        {state.navMenuIsOpen && <NavMenu />}
        <div className={styles.hamburger} onClick={() => toggleNavMenu()} aria-hidden="true">
          <Image src={menu} alt="menu" className={styles.menu} />
        </div>
        <div className={styles['logo-container']}>
          <Link href="/" passHref>
            <Image src={logo} alt="logo" className={styles['nav-logo']} />
          </Link>
          <Link href="/" passHref>
            <p className={styles['logo']}>Aynimar</p>
          </Link>
        </div>
        <div className={styles['navbar-left']}>
          <ul className={styles['menuNav']}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/recycling">Recicla</Link>
            </li>
            <li>
              <Link href="/store">Tienda</Link>
            </li>
            <li>
              <Link href="/contact">Contactanos</Link>
            </li>
            <li>
              <Link href="/aboutUs">Sobre nosotros</Link>
            </li>
          </ul>
        </div>

        <div className={styles['navbar-right']}>
          <ul>
            <li className={styles['navbar-selling-cart']} onClick={() => togglePayment()} aria-hidden="true">
              <Image className={`${styles['more-clickable-area']} ${styles.pointer}`} src={sellingCart} alt="selling to recycler cart" />
              {state.metacircle.length > 0 ? <div>{state.metacircle.length}</div> : null}
            </li>
            
            {isUserAuthenticated() ? (
              <li className={`${styles['more-clickeable-area']} ${styles['navbar-email']} ${styles.pointer}`} onClick={() => toggleMenu()} aria-hidden="true">
                <Image src={userIcon} alt="user icon menu" />
              </li>
            ) : (
              <li>
                <Link href="/login">Iniciar sesión</Link>
              </li>
            )}
            <li className={styles['navbar-shopping-cart']} onClick={() => toggleOrder()} aria-hidden="true">
              <Image className={`${styles['more-clickable-area']} ${styles.pointer}`} src={shoppingCart} alt="shopping cart" />
              {state.cart.length > 0 ? <div>{state.cart.length}</div> : null}
            </li>
          </ul>
        </div>
        {state.menuIsOpen && <Menu />}
      </nav>
      {state.orderIsOpen && <MyOrder />}
      {state.paymentIsOpen && <MyPayment />}
    </>
  );
};

export default Header;