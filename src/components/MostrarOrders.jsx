import React, { useState }  from 'react';
import OrderItem from '@components/OrderItem';
import Modal from '@common/Modal';
import styles from '@styles/ProductItem.module.scss';

const MostrarOrders = ({ order }) => {
    console.log('llegamos a Mostrar Orders y las order is:', order);

	const [open, setOpen] = useState(false);

	const transformedItems = order.items.map((item) => {
		// Aquí puedes realizar la transformación deseada en 'item'
		// Por ejemplo, puedes modificar una propiedad o agregar nuevas propiedades al objeto 'item'
		// Retorna el objeto transformado
		item.price / 100;
		return {
		  ...item, // Copia las propiedades originales del objeto 'item'
		  // Realiza las modificaciones o agrega nuevas propiedades según tus necesidades
		};
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
		</Modal>
		</>
	);
};

export default MostrarOrders;