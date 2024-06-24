import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PaymentItem from '@components/PaymentItem';
import AppContext from '@context/AppContext';
import arrow from '@icons/flechita.svg';
import styles from '@styles/MyOrder.module.scss';

const MyPayment = () => {
	const { state, togglePayment } = useContext(AppContext);

	const sumTotal = () => {
		const reducer = (accumalator, currentValue) => accumalator + currentValue.price;
		const sum = state.metacircle.reduce(reducer, 0);
		return sum.toFixed(2);
	}

	return (
		<aside className={styles.MyOrder}>
			<div className={styles['MyOrder-container']}>
				<div className={styles['title-container']}>
					<Image className={(styles['more-clickable-area'],
					styles.pointer)} src={arrow} alt="arrow" width={15} height={15}
					onClick={() => togglePayment ()} />
					<p className={styles.title}>My order</p>
				</div>
				<div className={styles['my-order-content']}>
					<div className={styles['my-orders']}>
						{state.metacircle.map((waste) => (
							<PaymentItem waste={waste} key={`orderItem-${waste.id}`} />
						))}
					</div>
					<div className={styles.order}>
						<p>
							<span>Total</span>
						</p>
						<p>${sumTotal()}</p>
					</div>
					<Link href="/checkout">
						<button className={styles['primary-button']} >Checkout</button>
					</Link>
				</div>
			</div>
		</aside>
	);
}

export default MyPayment;