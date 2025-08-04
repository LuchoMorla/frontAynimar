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
      setIsAuthenticated(authStatus);
    };

    // Verificar inmediatamente
    checkAuthStatus();

    // Verificar cada 500ms por si la cookie se establece después del redirect
    const authInterval = setInterval(checkAuthStatus, 500);

    // Limpiar el interval después de 5 segundos
    const timeout = setTimeout(() => {
      clearInterval(authInterval);
    }, 5000);

    return () => {
      clearInterval(authInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Effect principal para cargar datos del carrito
  useEffect(() => {
    // Si ya se cargó el carrito, no hacer nada
    if (cartLoaded || state.cart.length > 0) {
      return;
    }

    const guestOrderId = window.localStorage.getItem('oi');

    const fetchCartData = async () => {
      let orderData = null;

      try {
        if (isAuthenticated) {
          // --- FLUJO PARA USUARIO LOGUEADO ---
          console.log('Usuario autenticado. Buscando orden de "carrito"...');
          try {
            const { data } = await axios.get(endPoints.orders.getOrderByState, { 
              params: { state: 'carrito' } 
            });
            orderData = data;
            console.log('Carrito encontrado para usuario autenticado:', data);
          } catch (error) {
            console.log('El usuario autenticado no tiene una orden de tipo "carrito" activa.');
          }

        } else if (guestOrderId) {
          // --- FLUJO PARA INVITADO ---
          console.log(`Usuario invitado. Buscando orden de carrito #${guestOrderId}...`);
          const { data } = await axios.get(endPoints.orders.getGuestOrder(guestOrderId));
          orderData = data;
        }

        // Si se encontró una orden, procesarla
        if (orderData && orderData.items && orderData.items.length > 0) {
          console.log('Orden encontrada, poblando el estado del carrito con:', orderData.items);
          
          // Llenar el carrito en el Contexto Principal
          getCart(orderData.items);
          
          // Actualizar el otro contexto si es necesario
          if (orderState && orderState.setOrder) {
            orderState.setOrder(orderData);
          }

          // Asegurar que el ID de la orden esté en localStorage
          if (!window.localStorage.getItem('oi')) {
            window.localStorage.setItem('oi', `${orderData.id}`);
          }
        }

        // Marcar como cargado independientemente del resultado
        setCartLoaded(true);

      } catch (error) {
        console.error('Error al intentar cargar los datos del carrito:', error);
        
        // Limpiar orden de invitado inválida
        if (guestOrderId && !isAuthenticated && error.response && 
            (error.response.status === 404 || error.response.status === 403)) {
          console.log(`La orden de invitado #${guestOrderId} no es válida. Limpiando localStorage.`);
          window.localStorage.removeItem('oi');
        }
        
        setCartLoaded(true);
      }
    };

    // Solo ejecutar si tenemos información suficiente para decidir
    if (isAuthenticated || (!isAuthenticated && window.localStorage.getItem('oi'))) {
      fetchCartData();
    } else if (!isAuthenticated && !window.localStorage.getItem('oi')) {
      // Usuario no autenticado sin orden de invitado
      setCartLoaded(true);
    }

    // Dependencias: isAuthenticated y cartLoaded
  }, [isAuthenticated, cartLoaded, state.cart.length, getCart, orderState]);

  // Effect adicional para resetear cartLoaded cuando el usuario cambia de estado de autenticación
  useEffect(() => {
    setCartLoaded(false);
  }, [isAuthenticated]);

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
      {state.orderIsOpen && <MyOrder />}
      {state.paymentIsOpen && <MyPayment />}
    </>
  );
};

export default Header;