import React, { useState }  from 'react';
import OrderItem from '@components/OrderItem';
import Modal from '@common/Modal';
import styles from '@styles/ProductItem.module.scss';

const MostrarOrders = ({ order }) => {
    console.log('llegamos a Mostrar Orders y las order is:', order);

	const [open, setOpen] = useState(false);

	  const transformedItems = order.items.map((item) => {
		// Realiza una copia profunda del objeto 'item'
		const newItem = { ...item };
		// Realiza las modificaciones deseadas en 'newItem'
		newItem.price = newItem.price / 100;
		// Retorna el objeto transformado
		return newItem;
	  });

	return (
		<>
		<div className={styles.ProductItem}>
			<div className={styles['product-info']}>
				<div>
					<p>Orden-{order.id}</p>
					<p>Total de la orden: ${order.total / 100}</p>
					<p>Estado: {order.state == 'carrito' ? 'En caja' : 'Pagada'}</p>
					<p>Productos: {order.items ? order.items.length : order.items}</p>
					<button className={styles['pay-Button']} onClick={() => setOpen(true)}>Ver productos</button>
				</div>
			</div>
		</div>
		<Modal open={open} onClose={() => setOpen(false)}>
			<h3>Orden-{order.id}</h3>
			{transformedItems.map((product) => (
					<OrderItem product={product} key={`orderItem-${product.id}`} />
			))}
			<p>Total: ${order.total / 100}</p>
		</Modal>
		</>
	);
};

export default MostrarOrders;