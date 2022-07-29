import React, { /* useState, */ useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Menu from '@components/Menu';
import MyOrder from '@containers/MyOrder';
import menu from '@icons/icon_menu.svg';
import logo from '@logos/logo-Aynimar.svg';
import AppContext from '../context/AppContext';
import shoppingCart from '@icons/icon_shopping_cart.svg';
import userIcon from '@icons/user-icon-ecologist.svg'
import styles from '@styles/Header.module.scss';

const Header = () => {
/* 	const [toggle, setToggle] = useState(false); */
/* 	const [toggleOrders, setToggleOrders] = useState(false); */
/* 	const { state } = useContext(AppContext); */

	const { state, toggleOrder, toggleMenu } = useContext(AppContext);

/* 	const handleToggle = () => {
		setToggle(!toggle);
	}; */

	return (
		<>
		<nav className={styles.Nav}>
			<img src={menu.src} alt="menu" className={styles.menu} />
			<div className={styles['logo-container']}>
				<Link href="/" passHref>
					<Image src={logo} alt="logo" className={styles['nav-logo']} />
				</Link>
				<p className={styles['logo']}>Aynimar</p>
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
						<Link href="/">Tienda</Link>
					</li>
					<li>
						<Link href="/">Contactanos</Link>
					</li>
					<li>
						<Link href="/">Blog</Link>
					</li>
				</ul>
			</div>
			<div className={styles['navbar-right']}>
				<ul>
					<li className={(styles['more-clickeable-area'],
					styles['navbar-email'],
					styles.pointer)}
						onClick={() => toggleMenu()}
						aria-hidden="true"
					>
						<Image src={userIcon} width={50} height={40}/>
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
	</>
	);
};

export default Header;
