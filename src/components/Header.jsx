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
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const orderState = useContext(TestContext);
  const auth = useAuth();
  
  if (!token) {
    auth.getAuth();
    setToken('haveToken');
  }

  const { state, getCart, toggleOrder, toggleMenu, togglePayment, toggleNavMenu } = useContext(AppContext);

  // Función para verificar autenticación
  const checkAuthentication = () => {
    return !!Cookie.get('token');
  };

  // Effect para monitorear cambios en la autenticación
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = checkAuthentication();
      if (authStatus !== isAuthenticated) {
        setIsAuthenticated(authStatus);
        setCartLoaded(false);
      }
    };

    checkAuthStatus();

    const authInterval = setInterval(checkAuthStatus, 200);

    const handleStorageChange = () => { checkAuthStatus(); };
    window.addEventListener('storage', handleStorageChange);

    const handleTokenSet = () => {
      setTimeout(() => {
        const newAuthStatus = checkAuthentication();
        if (newAuthStatus !== isAuthenticated) {
          setIsAuthenticated(newAuthStatus);
          setCartLoaded(false);
        }
      }, 50);
    };
    window.addEventListener('tokenSet', handleTokenSet);

    const timeout = setTimeout(() => { clearInterval(authInterval); }, 10000);

    return () => {
      clearInterval(authInterval);
      clearTimeout(timeout);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenSet', handleTokenSet);
    };
  }, [isAuthenticated]);

  // Effect principal para cargar datos del carrito
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (cartLoaded && state.cart.length > 0) return;

    const guestOrderId = window.localStorage.getItem('oi');

    const fetchCartData = async () => {
      let orderData = null;

      try {
        if (isAuthenticated) {
          try {
            const response = await axios.get(endPoints.orders.getOrderByState, {
              params: { state: 'carrito' },
              headers: { 'Authorization': `Bearer ${Cookie.get('token')}` },
            });
            orderData = response.data;
          } catch (_) { /* no active cart — expected */ }

        } else if (guestOrderId) {
          try {
            const response = await axios.get(endPoints.orders.getGuestOrder(guestOrderId));
            orderData = response.data;
          } catch (_) { /* guest cart not found — expected */ }
        }

        if (orderData?.items?.length > 0) {
          getCart(orderData.items);
          if (orderState?.setOrder) orderState.setOrder(orderData);
          if (!window.localStorage.getItem('oi')) {
            window.localStorage.setItem('oi', `${orderData.id}`);
          }
        }

        setCartLoaded(true);

      } catch (error) {
        console.error('[Header] Error cargando carrito:', error.message);
        if (guestOrderId && !isAuthenticated && error.response &&
            (error.response.status === 404 || error.response.status === 403)) {
          window.localStorage.removeItem('oi');
        }
        setCartLoaded(true);
      }
    };

    fetchCartData();

  // getCart and orderState are excluded: their references change every render
  // (recreated in useInitialState/context) but their semantics are stable.
  // isAuthenticated and cartLoaded are the only real triggers for a re-fetch.
  }, [isAuthenticated, cartLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <header className={styles.navBar}>
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
              <Link href="/como-funciona" style={{ color: '#4900E4', fontWeight: '700' }}>¿Cómo funciona?</Link>
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
            
            {isAuthenticated ? (
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
      </header>
      {state.orderIsOpen && <MyOrder />}
      {state.paymentIsOpen && <MyPayment />}
    </>
  );
};

export default Header;