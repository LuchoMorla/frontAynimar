import React, { useContext } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png';
import endPoints from '@services/api/index';
import axios from 'axios';
import styles from '@styles/OrderItem.module.scss';

const OrderItem = ({ product }) => {
	const { removeFromCart } = useContext(AppContext);

	const orderProduct = product.OrderProduct;
	const amount = orderProduct.amount;

	const removeItemProduct = async (item) => {
		const config = {
		  headers: {
			accept: '*/*',
			'Content-Type': 'application/json',
		  },
		};
		const deleteItem = await axios.delete(endPoints.orders.deleteItem(item), config);
		return deleteItem.data;
	  };
	
	const handleRemove = (product) => {
		removeFromCart(product);
		const orderProductId = product.OrderProduct.id;
		if (!orderProductId) {
		  console.log('se cago, no accedi');
		}
		removeItemProduct(orderProductId);
	  };

	return (
		<div className={styles.OrderItem}>
			<figure>
				<Image src={product?.image} width={40} height={40} alt={product?.name} />
			</figure>
			<p>{product?.name}</p>
			{amount != null ? <p>${product?.price} x {amount}</p> : <p>${product?.price}</p>}
			<Image className={styles['more-clickable-area']}
				src={close} 
				alt="close" 
				width={18} 
				height={18} 
				onClick={() => handleRemove(product)} 
			/>
		</div>
	);
};

export default OrderItem;