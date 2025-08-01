import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OrderItem from '@components/OrderItem';
import AppContext from '@context/AppContext';
import arrow from '@icons/flechita.svg';
// La imagen de actualizar ya no es necesaria, la eliminamos
// import actualizarImg from '@icons/button_refresh_15001.png';
import styles from '@styles/MyOrder.module.scss';
// useRouter no se está usando, lo podemos quitar
// import { useRouter } from 'next/router';

const MyOrder = () => {
	const { state, toggleOrder } = useContext(AppContext);

	const sumTotal = () => {
		const reducer = (accumalator, currentValue) => {
		  if (currentValue.price && currentValue.OrderProduct && currentValue.OrderProduct.amount) {
			return accumalator + currentValue.price * currentValue.OrderProduct.amount;
		  } else {
			return accumalator;
		  }
		};
		const sum = state.cart.reduce(reducer, 0);
		return sum.toFixed(2);
	};

	let valorTotalSinIva = sumTotal();

	return (
		<aside className={styles.MyOrder}>
			<div className={styles['MyOrder-container']}>
				<div className={styles['title-container']}>
					<Image className={`${styles['more-clickable-area']} ${styles.pointer}`} src={arrow} alt="arrow" width={15} height={15}
					onClick={() => toggleOrder()} />
					<p className={styles.title}>Mi orden</p>
				</div>
				<div className={styles['my-order-content']}>
					<div className={styles['my-orders']}>
            {/* Si el carrito está vacío, muestra un mensaje amigable */}
						{state.cart.length > 0 ? (
              state.cart.map((product) => (
                <OrderItem product={product} key={`orderItem-${product.id}`} />
              ))
            ) : (
              <p className={styles.emptyMessage}>Tu carrito está vacío.</p>
            )}
					</div>
          
          {/* Mostramos el total solo si hay productos en el carrito */}
          {state.cart.length > 0 && (
            <>
              <div className={styles.order}>
                <p>
                  <span>Total:</span>
                </p>
                <p>
                  ${valorTotalSinIva}
                  {/* El botón de actualizar ha sido eliminado */}
                </p>
              </div>
              <Link href="/checkout">
                <button className={styles['primary-button']} >Checkout</button>
              </Link>
            </>
          )}
				</div>
			</div>
		</aside>
	);
}

export default MyOrder;