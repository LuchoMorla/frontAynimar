import React, { useContext } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png';
import useGetOrder from '@hooks/useGetOrder';
import endPoints from '@services/api';
import styles from '@styles/CheckoutOrderItem.module.scss';

const CheckoutOrderItem = ({ product }) => {
	const { removeFromCart } = useContext(AppContext);

	const handleRemove = product => {
		removeFromCart(product);
	};

	const order = useGetOrder(endPoints.profile.orders);

	console.log(order);
	console.log(order.id);
	console.log(order.items.id);
	console.log(order.items.OrderProduct.id);
	console.log('amount ', order.items.OrderProduct.amount);

	return (
		<div className={styles.OrderItem}>
			<figure>
				<Image src={product?.image} width={10} height={10} alt={product?.title} />
			</figure>
			<p>{product?.title}</p>
			<p>{order?.items.OrderProduct.amount}</p>
			<p>${product?.price}</p>
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