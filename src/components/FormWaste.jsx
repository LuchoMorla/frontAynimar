import React, { useContext, useRef } from 'react';
import AppContext from '@context/AppContext';
import axios from 'axios';
import endPoints from '@services/api';
import Image from 'next/image';
import addToCart from '@icons/bt_add_to_cart.svg';
import styles from '@styles/ProductInfo.module.scss';

const WasteInfo = ({ product }) => {
	const { state,/*  addToMetacircle, */ usePaymentId } = useContext(AppContext);
	const formRef = useRef(null);

	const createPayment = async () => {
		const post = await axios.post(endPoints.payments.postPayment);
		return post.data;
	}

	const submitHandler = async (event) => {
		event.preventDefault();
		const addToPacket = async (paymentId) => {
			const config = {
				headers: {
				  accept: '*/*',
				  'Content-Type': 'application/json',
				},
			  };
			const formData = new FormData(formRef.current);
			const packet = {
				paymentId: paymentId,
				wasteId: product.id,
				amount: parseInt(formData.get('amount'))
			}
			const addProductToThePacked = await axios.post(endPoints.payments.postCommodity, packet, config);
			return addProductToThePacked;
		}
		const savedPaymentId = window.localStorage.getItem('pi');

		if(savedPaymentId == null){
			const getPayment = await createPayment();
			window.localStorage.setItem('pi', `${getPayment.id}`);
			const bornedPaymentId = getPayment.id;
			addToPacket(bornedPaymentId)
		} else {
			const numberPaymentId = parseInt(savedPaymentId);
			usePaymentId(numberPaymentId);
			addToPacket(numberPaymentId);
		}
	}

	return (
		<>
		<div className={styles['stand_container']}>
		<img src={product?.image} width={300} height={300} alt={product?.name} className={styles.image}/>
			<div className={styles.ProductInfo}>
				<form ref={formRef} onSubmit={submitHandler} >
					<p>${product?.price / 100}</p>
					<p>{product?.name}</p>
					<p>{product?.description}</p>
					<label htmlFor="amount">cantidad: </label>
					<input type="number" id="amount" name='amount' min={1}/>
					<button type='submit' className={(styles['primary-button'], styles['add-to-cart-button'])}>
					<Image src={addToCart} width={24} height={24} alt="add to cart" />
					Agrega al carrito
					</button>
				</form>
			</div>
		</div>
		</>
	);
};
export default WasteInfo;
