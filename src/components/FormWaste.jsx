import React, { useContext, useRef } from 'react';
import AppContext from '@context/AppContext';
import axios from 'axios';
import endPoints from '@services/api';
import Image from 'next/image';
import addToCartButton from '@icons/bt_add_to_cart.svg';
import { useRouter } from 'next/router';
import styles from '@styles/ProductInfo.module.scss';

const WasteInfo = ({ product }) => {
	const { addToMetacircle, PaymentId, } = useContext(AppContext);
	const formRef = useRef(null);
	const router = useRouter();

	const handleClick = item => {
		addToMetacircle(item);
	};

	const handleRedirect = () => {
		window.alert('hemos registrado tú pedido, nos comunicaremos con tigo para pasar a recolectar el producto, te redigiremos a una nueva pagina para confirmar tús datos de contacto');
		router.push('/mi_cuenta/recycler');
	};

	const createPayment = async () => {
		const post = await axios.post(endPoints.payments.postPayment);
		return post.data;
	};

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
			};
			const addProductToThePacked = await axios.post(endPoints.payments.postCommodity, packet, config);
			return addProductToThePacked;
		};
		const savedPaymentId = window.localStorage.getItem('pi');

		if(savedPaymentId == null){
			const getPayment = await createPayment();
			window.localStorage.setItem('pi', `${getPayment.id}`);
			const bornedPaymentId = getPayment.id;
			addToPacket(bornedPaymentId)
			.then(() => {
				handleClick(product);
				handleRedirect();
			})
			.catch((error) => {
				if (error.response?.status === 401) {
					window.alert('algo salio mal');
				} else if (error.response) {
					window.alert('Algo salio mal: ' + error.response.status);
				  console.log('Algo salio mal: ' + error.response.status);
				  if (error.response.status == 409) {
					window.alert('es probable que ya estes registrado te invitamos a crear una nueva contraseña en caso de que la hayas olvidado');
					router.push('/forgotPassword');
				  }
				}
			  });
		} else {
			const numberPaymentId = parseInt(savedPaymentId);
			PaymentId(numberPaymentId);
			addToPacket(numberPaymentId)
			.then(() => {
				handleClick(product);
				handleRedirect();
			})
			.catch((error) => {
				if (error.response?.status === 401) {
					window.alert('algo salio mal');
				} else if (error.response) {
					window.alert('Algo salio mal: ' + error.response.status);
				  console.log('Algo salio mal: ' + error.response.status);
				  if (error.response.status == 409) {
					window.alert('es probable que ya estes registrado te invitamos a crear una nueva contraseña en caso de que la hayas olvidado');
					router.push('/forgotPassword');
				  };
				};
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
					<input type="number" required id="amount" name='amount' min={1}/>
					<button type='submit' className={styles['add-to-cart-button']}>
					<Image src={addToCartButton} width={24} height={24} alt="add to cart" />
					Vender producto
					</button>
				</form>
			</div>
		</div>
		</>
	);
};
export default WasteInfo;
