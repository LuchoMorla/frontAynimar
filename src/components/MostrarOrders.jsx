import React from 'react';
import styles from '@styles/ProductItem.module.scss';

const MostrarOrders = ({ order }) => {
    console.log('llegamos a Mostrar Orders y las order is:', order);

	return (
		<div className={styles.ProductItem}>
			<div className={styles['product-info']}>
				<div>
					<p>Orden-{order.id}</p>
					<p>total de la orden: ${order.total / 100}</p>
					<p>Estado: {order.state == 'carrito' ? 'En caja' : 'Pagada'}</p>
					<p>#Productos: {order.items ? order.items.length : order.items}</p>
				</div>
			</div>
		</div>
	);
};

export default MostrarOrders;