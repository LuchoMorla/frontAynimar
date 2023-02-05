import React, { useContext,/* useEffect, */ useRef, useState } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png'; 
import endPoints from '@services/api'; 
import actualizarImg from '@icons/button_refresh_15001.png';
import axios from 'axios';
import styles from '@styles/CheckoutOrderItem.module.scss';


const CheckoutOrderItem = ({ product }) => {/* 
	const { state } = useContext(AppContext); */
	const [buttonOpen, setUpdateButton] = useState(false);
	const [dataAmount, setChangeDataAmount] = useState({});
	const { removeFromCart } = useContext(AppContext);
/* 	const handleRemove = product => {
		removeFromCart(product);
	}; */
	const inputRef = useRef(null),
	divRef = useRef(null);

	const actualizarCantidad = async (data) => {
		const config = {
			headers: {
			  accept: '*/*',
			  'Content-Type': 'application/json',
			},
		  };
		  const {amount, productId, orderId } = data;
		  const body = {
			amount: amount,
			productId: productId,
			orderId: orderId
		  };
		const id = data.itemId;
		const { data: update } = await axios.patch(endPoints.orders.editItem(id), body, config);

		setUpdateButton(false);
		  return update;
	};

	const changeAmountOfItem = (product) => {
		let amountInt = inputRef.current.value;
		const orderProduct = product.OrderProduct;
		const itemId = orderProduct.id;
		const data = {
		  itemId: itemId,
		  amount: parseInt(amountInt),
		  productId: product.id,
		  orderId: orderProduct.orderId,
		};
		product.OrderProduct.amount = amountInt;		
		setChangeDataAmount(data);
		setUpdateButton(true);
	};

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

	const handleRemove = product => {
		removeFromCart(product);
		const orderProductId = product.OrderProduct.id;
		if(!orderProductId) {
			console.log('se cago, no accedi');
		}
		removeItemProduct(orderProductId);
	};

	return (
		<div className={styles.OrderItem}>
			<figure>
				<Image src={product?.image} width={30} height={30} alt={product?.title} />
			</figure>
			
			<p>{product?.name}</p>

			<div ref={divRef} onChange={() => changeAmountOfItem(product)}>
				<label htmlFor="amountChanged" className={styles.label}>cantidad:</label>
				<input  ref={inputRef} type="number" id="amountChanged" name="amountChanged" className={styles.inputAmount}
				defaultValue={product?.OrderProduct.amount} />
				{buttonOpen == true ? <button className={styles.updateButton} onClick={() => actualizarCantidad(dataAmount)}><Image src={actualizarImg} width={25} height={25} alt="Actualizar cantidad | update amount"/></button> : null}
			</div>

			<p>{screen.width <= 660 ? `P/u $${product?.price}` : `Precio/unidad $${product?.price}`}</p>

			<p>${(product?.price * product?.OrderProduct.amount).toFixed(2)}</p>

			

			<Image className={styles['more-clickable-area']}
			src={close}
			alt="close"
            width={20}
            height={20}
			onClick={() => handleRemove(product)} />
		</div>
	);
};

export default CheckoutOrderItem;