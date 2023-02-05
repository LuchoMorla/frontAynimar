import React/* , { useContext } */ from 'react';
import Image from 'next/image';
/* import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png'; */
import styles from '@styles/OrderItem.module.scss';
/* import endPoints from '@services/api/index';
import axios from 'axios'; */

const OrderItem = ({ product }) => {

/* 	const handleEdit = someID => {

	}; */
	return (
		<div className={styles.OrderItem}>
			<figure>
				<Image src={product?.image} width={40} height={40} alt={product?.name} />
			</figure>
			{/* <p onClick={() => {}}>Edit</p> */}
			<p>{product?.name}</p>
			<p>${product?.price}</p>
{/* 			<Image className={(styles.pointer, styles['more-clickable-area'])}
			src={close}
			alt="close"
			onClick={() => handleRemove(product)} /> */}
		</div>
	);
};

export default OrderItem;