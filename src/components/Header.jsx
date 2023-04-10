import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '@components/Menu';
import NavMenu from '@components/NavMenu';
import MyOrder from '@containers/MyOrder';
import MyPayment from '@containers/MyPayment';
import menu from '@icons/icon_menu.svg';
import logo from '@logos/logo-Aynimar.svg';
import AppContext from '@context/AppContext';
import shoppingCart from '@icons/icon_shopping_cart.svg';
import sellingCart from '@icons/reciclando.svg';
import userIcon from '@icons/user-icon-ecologist.svg';
import endPoints from '@services/api/index';
import axios from 'axios';
import styles from '@styles/Header.module.scss';

const Header = () => {
/* 	const [toggle, setToggle] = useState(false); */
/* 	const [toggleOrders, setToggleOrders] = useState(false); */
/* 	const { state } = useContext(AppContext); */
const [token, setToken] = useState(null)/* ,
		[logged, setLogged] = useState(false) */;
	const hola = useAuth();
	if(!token) {
		hola.getAuth();
		setToken('haveToken');
/* 		if(!cookie) {
			throw error;
		}
		if (cookie == true) {

			setLogged(true);
		} */
	}

	const { state, getCart, toggleOrder, toggleMenu, togglePayment, toggleNavMenu } = useContext(AppContext);
/* 	const handleToggle = () => {
		setToggle(!toggle);
	}; */
/* 	const auth = useAuth();
	const userData = {
		id: auth?.user?.id,
		email: auth?.user?.email,
		role: auth?.user?.role
	} */
	const fetchOrders = async () => {
		/* Funccion en la que agregamos los productos que estan en el carrito */
		if(state.cart.length <= 0)	{
			const { data: getOrder } = await axios.get(endPoints.orders.getOrderByState, {  params: { state: 'carrito' } });
			const items = getOrder.items;
			items.forEach(el => {
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
	useEffect(async () => {
		try {
			await fetchOrders();
		} catch (error) {
			console.log(error);
			if(error.status == 401) {
				console.log('funciono doble CATCH Luis, campuramos el error 401 mira-> ' + error.status + ` y  tambien el mensaje es ${error.message}`);
			  }
		}
	}, [endPoints.orders.getOrderByState]);

	return (
		<>
		<nav className={styles.Nav}>
		{state.navMenuIsOpen && <NavMenu />}
			<div className={styles.hamburger}
			onClick={() => toggleNavMenu()}
			aria-hidden="true" >
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
						<Link href="/recycling">Reciclar</Link>
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
{/* 			<div>
				{
				 logged == true ? <p>
					iniciar session
					</p> : null
				}
			</div> */}
			<div className={styles['navbar-right']}>
				<ul>
					<li className={styles['navbar-selling-cart']}
					onClick={() => togglePayment()}
					aria-hidden="true"
					>
						<Image className={(styles['more-clickable-area'],
						styles.pointer)}
						src={sellingCart}
						alt="selling to recicler cart"
						/>						
						{state.metacircle.length > 0 ? <div>
							{state.metacircle.length}</div> : null}

					</li>
					<li className={(styles['more-clickeable-area'],
					styles['navbar-email'],
					styles.pointer)}
						onClick={() => toggleMenu()}
						aria-hidden="true"
					>
						<Image src={userIcon} width={50} height={40} alt='user icon menu'/>
					</li>
					<li
						className={styles['navbar-shopping-cart']}
						onClick={() => toggleOrder()}
						aria-hidden="true"
					>
						<Image className={(styles['more-clickable-area'],
						styles.pointer)}
						src={shoppingCart}
						alt="shopping cart" />
						{state.cart.length > 0 ? <div>
							{state.cart.length}</div> : null}
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
