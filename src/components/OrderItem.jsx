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
		console.log('removeItemProduct');
		console.log('recivo item: ', item);
		console.log(item);
		const config = {
		  headers: {
			accept: '*/*',
			'Content-Type': 'application/json',
		  },
		};
		console.log('consulta, enviamos: ', item);
		console.log(item);
		console.log('parametro 1 en consulta: ', endPoints.orders.deleteItem(item));
		console.log(endPoints.orders.deleteItem(item));
		const deleteItem = await axios.delete(endPoints.orders.deleteItem(item), config)
			.catch((err) => {
			console.log({ err });
			console.log('algo paso con deleteItem');
		});
		console.log(deleteItem);
		return deleteItem.data;
	  };
	
	const handleRemove = (product) => {
		console.log('handle Remove');
		console.log(product);
		// const orderProductId = product.id ;
		
		//cambiojoseluis
		const orderProductId = product.OrderProduct.id ;
		
		/* const { id } = product; 
		console.log('destructured id:', id);*/
		/* 
		const orderProductId = product.OrderProduct.id; */
		console.log('orderProductId', orderProductId);
		if (!orderProductId) {
		  console.log('se cago, no accedi');
		}
		console.log('vamos a declarar el exito');
		removeItemProduct(orderProductId)
/* 		.then(()=> {

		}) */
		.catch((err) => {
			console.log({ err });
			console.log('algo paso con removeItemProduct');
		});
		console.log('removeFromCart');
		removeFromCart(product);
		console.log('si desaparecio es por que lo hicimos bien');
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