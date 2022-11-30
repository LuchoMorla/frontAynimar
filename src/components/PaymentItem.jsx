import React, { useContext } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png';
import styles from '@styles/OrderItem.module.scss';

const PaymentItem = ({ waste }) => {
	const { removeFromMetacircle } = useContext(AppContext);

	const handleRemove = waste => {
		removeFromMetacircle(waste);
	};

	return (
		<div className={styles.OrderItem}>
			<figure>
				<Image src={waste?.image} width={40} height={40} alt={waste?.name} />
			</figure>
			<p>{waste?.name}</p>
			<p>${waste?.price / 100}</p>
			<Image className={styles.pointer/* , styles['more-clickable-area'] )*/}
			src={close}
			alt="close"
			onClick={() => handleRemove(waste)} />
		</div>
	);
};

export default PaymentItem;