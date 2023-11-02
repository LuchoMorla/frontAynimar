import React, { useContext, useRef }  from 'react';
import AppContext from '@context/AppContext';
import Image from 'next/image';
import axios from 'axios';
import endPoints from '@services/api';
import Cookie from 'js-cookie';
import Link from 'next/link'; 
import { useRouter } from 'next/router';
import addToCartImage from '@icons/bt_add_to_cart.svg';
import addedToCartImage from '@icons/bt_added_to_cart.svg'; 
import styles from '@styles/ProductItem.module.scss';

const ProductItem = ({ product }) => {
	const router = useRouter();

	const { state, addToCart } = useContext(AppContext);
	const formRef = useRef(null);

	const createOrder = async () => {
		const post = await axios.post(endPoints.orders.postOrder);
		return post.data;
	};

	const handleClick = item => {
		item.price = item.price / 100;
		addToCart(item);
		item.price = item.price * 100;
	};

	const submitHandler = async (event) => {
		event.preventDefault();
		const userHaveToken = Cookie.get('token');
		if(!userHaveToken) {
			alert('para realizar esta accion necesitas iniciar sesion');
			router.push('/login');
		};
		product.OrderProduct = 1;
		const addToPacket = async (orderId) => {
			/* const formData = new FormData(formRef.current); 
			console.log(formData);*/
			const packet = {
				orderId: orderId,
				productId: product.id,
				amount: 1 /* parseInt(formData.get('amount'))  */// parseInt(formData.get('amount')) -> <input type="number" id="amount" name='amount' min={1} required />
			};

			const config = {
				headers: {
				  accept: '*/*',
				  'Content-Type': 'application/json',
				},
			  };

			const addProductToThePacked = await axios.post(endPoints.orders.postItem, packet, config);
			console.log('addProductToThePacked', addProductToThePacked);
			return addProductToThePacked; 

		};
		
		const savedOrderId = window.localStorage.getItem('oi');
		if(savedOrderId == null){
			const getOrder = await createOrder();
			const bornedOrderId = getOrder.id;
			window.localStorage.setItem('oi', `${bornedOrderId}`);
			
			handleClick(product);
			addToPacket(bornedOrderId)
			.then(() => {/* 
				handleClick(product); */
			/* 	debugger; */
				/* router.reload(); */
			})
			.catch((err) => {
				if (err.response?.status === 401) {
					window.alert('Probablemente necesites iniciar sesion de nuevo');
				  } else if (err.response) {
					console.log('Algo salio mal: ' + err.response.status);
				  }
			});
		} else {
			const numberOrderId = parseInt(savedOrderId);
			handleClick(product);
			addToPacket(numberOrderId)
			.then(() => {/* 
				handleClick(product); */
/* 				debugger; */
				/* router.reload(); */
			})
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
		<div className={styles.ProductItem}>
			<Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
				<Image src={product.image} width={240} height={240} alt={product.description} />
			</Link>
			<div className={styles['product-info']}>
				<div>
					<p>${product.price}</p>
					<Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
					<p className={styles.productName}>{product.name}</p>
					</Link>
				</div>
				<form ref={formRef} onSubmit={submitHandler} >
					<input /* type="number" */ type="hidden" id="amount" name='amount' value='1' min={1} required />{/* podriamos usar cambios de estado */}
					<button type='submit' className={(styles['primary-button'], styles['add-to-cart-button'])}>
						<figure className={styles['more-clickable-area']} aria-hidden="true">
							{state.cart.includes(product) ? (
								<Image
									className={`${styles.disabled} ${styles['add-to-cart-btn']}`}
									src={addedToCartImage}
									alt="added to cart" 
								/> 
								) : ( 
								<Image
									className={'addToCartImage'}
									src={addToCartImage} /* width={24} height={24} */
									alt="add to cart" 
								/>
							)}
						</figure>
					</button> 
				</form>
			</div>
		</div>
	);
};
ProductItem.displayName = 'ProductItem';

export default ProductItem;