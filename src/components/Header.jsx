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
  const orderState = useContext(TestContext);
  const hola = useAuth();
  if (!token) {
    hola.getAuth();
    setToken('haveToken');
  }

  const getCookieUserValidator = () => {
    const token = Cookie.get('token');
    if(!token){
      return false;
    } 
    return true;
 };

 const isTokenValid = () => {
  return getCookieUserValidator();
};

  const { state, getCart, toggleOrder, toggleMenu, togglePayment, toggleNavMenu } = useContext(AppContext);

  const fetchOrders = async () => {
    if (state.cart.length <= 0) {
      const { data: getOrder } = await axios.get(endPoints.orders.getOrderByState, { params: { state: 'carrito' } });
      orderState.setOrder(getOrder);
      const items = getOrder.items;
      items.forEach((el) => {
        el.price = el.price / 100;
      });
      if (items.length > 0) {
        getCart(items);
        const getStorageOrderId = window.localStorage.getItem('oi');
        if (!getStorageOrderId) {
          window.localStorage.setItem('oi', `${getOrder.id}`);
        }
      }
    }
  };

  useEffect(() => {
    //log 
    isTokenValid();
    //fetch Orders
    const fetchMyOrders = async () => {
      try {
        await fetchOrders();
      } catch (error) {
        console.log(error);
        if (error.status == 401) {
          console.log('funciono doble CATCH Luis, campuramos el error 401 mira-> ' + error.status + ` y  tambien el mensaje es ${error.message}`);
        }
      }
    };
    fetchMyOrders();
  }, [endPoints.orders.getOrderByState, token]);

/*   useEffect(() => {
    isTokenValid();
    const tokenIsValid = isTokenValid(token); 
    // Realiza cualquier lógica adicional basada en la validez del token aquí

  }, [token]); */

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
          <ul>
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
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>

        <div className={styles['navbar-right']}>
          <ul>
            <li className={styles['navbar-selling-cart']} onClick={() => togglePayment()} aria-hidden="true">
              <Image className={(styles['more-clickable-area'], styles.pointer)} src={sellingCart} alt="selling to recycler cart" />
              {state.metacircle.length > 0 ? <div>{state.metacircle.length}</div> : null}
            </li>
{/*             {
              //Añadire logica para que esto aparezca cuando el usuario haya iniciado session
              <li className={(styles['more-clickeable-area'], styles['navbar-email'], styles.pointer)} onClick={() => toggleMenu()} aria-hidden="true">
              <Image src={userIcon} width={50} height={40} alt="user icon menu" />
            </li>
            } */}
            {
              isTokenValid() ? ( // Verifica si el token existe
              <li className={(styles['more-clickeable-area'], styles['navbar-email'], styles.pointer)} onClick={() => toggleMenu()} aria-hidden="true">
                <Image src={userIcon} alt="user icon menu" />
              </li>
            ) : (
              <li>
                <Link href="/login">Iniciar sesión</Link>
              </li>
            )
            }
            <li className={styles['navbar-shopping-cart']} onClick={() => toggleOrder()} aria-hidden="true">
              <Image className={(styles['more-clickable-area'], styles.pointer)} src={shoppingCart} alt="shopping cart" />
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
