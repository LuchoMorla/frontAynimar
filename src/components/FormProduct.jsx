import React, { useContext, useRef }  from 'react';
import AppContext from '@context/AppContext';
import axios from 'axios';
import endPoints from '@services/api';
import Image from 'next/image';
import addToCartImage from '@icons/bt_add_to_cart.svg';
/* import addToPacket from '@hooks/useItems'; */
import styles from '@styles/ProductInfo.module.scss';

const ProductInfo = ({ product }) => {

	const { addToCart, /* OrderId */ } = useContext(AppContext);
	const formRef = useRef(null);

	const createOrder = async () => {
		const post = await axios.post(endPoints.orders.postOrder);
		return post.data;
	};

	const handleClick = item => {
		addToCart(item);
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		const addToPacket = async (orderId) => {
			const config = {
				headers: {
				  accept: '*/*',
				  'Content-Type': 'application/json',
				},
			  };
			const formData = new FormData(formRef.current);
			const packet = {
				orderId: orderId,
				productId: product.id,
				amount: parseInt(formData.get('amount'))
			};

			console.log(packet.orderId);
			console.log(packet.productId);
			console.log(packet.amount);

			const addProductToThePacked = await axios.post(endPoints.orders.postItem, packet, config);
			console.log(addProductToThePacked);
			return addProductToThePacked;
		};
		
		const savedOrderId = window.localStorage.getItem('oi');

		if(savedOrderId == null){
			const getOrder = await createOrder();
			const bornedOrderId = getOrder.id;
			window.localStorage.setItem('oi', `${bornedOrderId}`);
			handleClick(product);
			addToPacket(bornedOrderId)
			.catch((err) => {
				if (err.response?.status === 401) {
					window.alert('Probablemente necesites iniciar sesion de nuevo');
				  } else if (err.response) {
					console.log('Algo salio mal: ' + err.response.status);
				  }
			});
		} else {
			handleClick(product);
			const numberOrderId = parseInt(savedOrderId);
			/* Creo que queria guardar el numero de order id en el local storage OrderId(numberOrderId); */
			addToPacket(numberOrderId)
			.catch((err) => {
				if (err.response?.status === 401) {
					window.alert('Probablemente necesites iniciar sesion de nuevo');
				  } else if (err.response) {
					console.log('Algo salio mal: ' + err.response.status);
				  }
			});
		};
	};
	return (
		<>
		<div className={styles['stand_container']}>
		{ product?.image &&
		<Image src={product?.image} width={300} height={300} alt={product?.name} className={styles.image}/>
		}
			<div className={styles.ProductInfo}>
			<form ref={formRef} onSubmit={submitHandler} >
				<p>${product?.price / 100}</p>
				<p>{product?.name}</p>
				<p>{product?.description}</p>
				<label htmlFor="amount">cantidad: </label>
				<input type="number" id="amount" name='amount' min={1} required />
				<button type='submit' className={(styles['primary-button'], styles['add-to-cart-button'])}>
					<Image src={addToCartImage} width={24} height={24} alt="add to cart" />
					Agrega al carrito
					</button>
			</form>
			</div>
		</div>
		</>
	);
};
export default ProductInfo;