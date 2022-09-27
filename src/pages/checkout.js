import Head from 'next/head';
import React, { useContext } from 'react';
import AppContext from '@context/AppContext';
import CheckOrderItem from '@components/CheckoutOrderItem';
import styles from '@styles/Checkout.module.scss';

const Checkout = () => {
  const { state } = useContext(AppContext);

  const sumTotal = () => {
		const reducer = (accumalator, currentValue) => accumalator + currentValue.price;
		const sum = state.cart.reduce(reducer, 0);
		return sum.toFixed(2);
	};

  return (
    <>
      <Head>
        <title>Checkout | Aynimar</title>
      </Head>
      <div className={styles.Checkout}>
        <div className={styles['Checkout-container']}>
          <h1 className={styles.title}>My order</h1>
          <div className={styles['Checkout-content']}>			
            <div className={styles['my-orders']}>
						{state.cart.map((product) => (
							<CheckOrderItem product={product} key={`orderItem-${product.id}`} />
						))}
					</div>
					<div className={styles.order}>
						<p>
							<span>Total</span>
						</p>
						<p>${sumTotal()}</p>
					</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
