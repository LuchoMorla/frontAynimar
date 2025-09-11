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
        console.log('Estado de autenticación cambió:', authStatus);
        setIsAuthenticated(authStatus);
        // Resetear cartLoaded cuando cambia el estado de auth
        setCartLoaded(false);
      }
    };

    // Verificar inmediatamente
    checkAuthStatus();

    // Verificar cada 200ms por si la cookie se establece después del redirect
    const authInterval = setInterval(checkAuthStatus, 200);

    // También escuchar eventos de storage por si la cookie se establece en otra pestaña
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Event listener personalizado para cuando se establece el token
    const handleTokenSet = () => {
      console.log('🔔 Evento tokenSet recibido en Header');
      setTimeout(() => {
        const newAuthStatus = checkAuthentication();
        console.log('🔍 Verificando auth después de tokenSet:', newAuthStatus);
        if (newAuthStatus !== isAuthenticated) {
          setIsAuthenticated(newAuthStatus);
          setCartLoaded(false);
        }
      }, 50);
    };
    
    window.addEventListener('tokenSet', handleTokenSet);

    // Limpiar después de 10 segundos
    const timeout = setTimeout(() => {
      clearInterval(authInterval);
    }, 10000);

    return () => {
      clearInterval(authInterval);
      clearTimeout(timeout);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenSet', handleTokenSet);
    };
  }, [isAuthenticated]);

  // Effect principal para cargar datos del carrito
  useEffect(() => {
    console.log('useEffect carrito ejecutándose:', { 
      cartLoaded, 
      cartLength: state.cart.length, 
      isAuthenticated 
    });

    // Si ya se cargó el carrito y tiene items, no hacer nada
    if (cartLoaded && state.cart.length > 0) {
      console.log('Carrito ya cargado con items, saltando...');
      return;
    }

    const guestOrderId = window.localStorage.getItem('oi');
    console.log('guestOrderId desde localStorage:', guestOrderId);

    const fetchCartData = async () => {
      let orderData = null;

      try {
        if (isAuthenticated) {
          // --- FLUJO PARA USUARIO LOGUEADO ---
          console.log('🔐 Usuario autenticado. Buscando orden de "carrito"...');
          try {
            const response = await axios.get(endPoints.orders.getOrderByState, { 
              params: { state: 'carrito' },
              headers: {
                'Authorization': `Bearer ${Cookie.get('token')}`
              }
            });
            orderData = response.data;
            console.log('✅ Carrito encontrado para usuario autenticado:', orderData);
          } catch (error) {
            console.log('ℹ️ El usuario autenticado no tiene una orden de tipo "carrito" activa.');
            console.log('Error details:', error.response?.status, error.response?.data);
          }

        } else if (guestOrderId && !isAuthenticated) {
          // --- FLUJO PARA INVITADO ---
          console.log(`👤 Usuario invitado. Buscando orden de carrito #${guestOrderId}...`);
          try {
            const response = await axios.get(endPoints.orders.getGuestOrder(guestOrderId));
            orderData = response.data;
            console.log('✅ Carrito encontrado para invitado:', orderData);
          } catch (error) {
            console.log('❌ Error cargando carrito de invitado:', error.response?.status);
          }
        }

        // Si se encontró una orden, procesarla
        if (orderData && orderData.items && orderData.items.length > 0) {
          console.log('📦 Procesando orden encontrada, items:', orderData.items.length);
          
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
        } else {
          console.log('🛒 No se encontró carrito o está vacío');
        }

        // Marcar como cargado independientemente del resultado
        setCartLoaded(true);

      } catch (error) {
        console.error('❌ Error al intentar cargar los datos del carrito:', error);
        
        // Limpiar orden de invitado inválida
        if (guestOrderId && !isAuthenticated && error.response && 
            (error.response.status === 404 || error.response.status === 403)) {
          console.log(`🧹 La orden de invitado #${guestOrderId} no es válida. Limpiando localStorage.`);
          window.localStorage.removeItem('oi');
        }
        
        setCartLoaded(true);
      }
    };

    // Ejecutar la carga si:
    // 1. El usuario está autenticado, O
    // 2. Es invitado pero tiene un guestOrderId, O
    // 3. No está autenticado y no tiene guestOrderId (para marcar como cargado)
    console.log('🎯 Condiciones para cargar:', {
      isAuthenticated,
      hasGuestOrder: !!guestOrderId,
      shouldLoad: isAuthenticated || guestOrderId || (!isAuthenticated && !guestOrderId)
    });

    if (isAuthenticated || guestOrderId || (!isAuthenticated && !guestOrderId)) {
      fetchCartData();
    }

  }, [isAuthenticated, cartLoaded, state.cart.length, getCart, orderState]);

  // Effect adicional para resetear cartLoaded cuando el usuario cambia de estado de autenticación
  useEffect(() => {
    console.log('🔄 Reseteando cartLoaded por cambio de autenticación');
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