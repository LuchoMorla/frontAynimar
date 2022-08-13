import React/* , { useContext, useRef } */ from 'react';
/* import AppContext from '@context/AppContext'; */
import Image from 'next/image';
import addToCart from '@icons/bt_add_to_cart.svg';
import styles from '@styles/ProductInfo.module.scss';

const WasteInfo = ({ product }) => {
/* 	const { state, addToMetacircle } = useContext(AppContext);
	const formRef = useRef(null);

	const submitHandler = (product) => {
		const formData = new FormData(formRef.current);
		console.log(formData);
		addToMetacircle(product);
	} */

	return (
		<>
		<div className={styles['stand_container']}>
		<img src={product?.image} width={300} height={300} alt={product?.name} className={styles.image}/>
			<div className={styles.ProductInfo}>
{/* 				<form action="#" ref={formRef} onSubmit={submitHandler} > */}
					<p>${product?.price / 100}</p>
					<p>{product?.name}</p>
					<p>{product?.description}</p>
					<label htmlFor="amount">cantidad: </label>
					<input type="number" id="amount" name='amount' min={1}/>
					<button type='submit' className={(styles['primary-button'], styles['add-to-cart-button'])}>
					<Image src={addToCart} width={24} height={24} alt="add to cart" />
					Add to cart
					</button>
{/* 				</form> */}
			</div>
		</div>
		</>
	);
};
export default WasteInfo;
