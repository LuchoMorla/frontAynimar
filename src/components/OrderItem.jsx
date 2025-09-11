import React, { useContext } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import Cookie from 'js-cookie'; // Necesario para verificar si el usuario está logueado
import { toast } from 'react-toastify'; // Para dar feedback al usuario
import close from '@icons/icon_close.png';
import endPoints from '@services/api/index';
import axios from 'axios';
import styles from '@styles/OrderItem.module.scss';

const OrderItem = ({ product }) => {
  const { removeFromCart } = useContext(AppContext);

  // Usamos optional chaining para acceder de forma segura a las propiedades.
  // Esto previene errores si `product` o `OrderProduct` no existen.
  const amount = product?.OrderProduct?.amount;

  // La función handleRemove ahora es asíncrona y contiene toda la lógica.
  const handleRemove = async () => {
    // 1. Obtenemos el ID del item en la tabla 'orders_products'
    const itemToDeleteId = product?.OrderProduct?.id;

    // Verificación de seguridad: si no hay ID, no podemos continuar.
    if (!itemToDeleteId) {
      toast.error('No se pudo encontrar el ID del producto en el carrito.');
      console.error('Error: product.OrderProduct.id no está disponible en:', product);
      return;
    }

    // 2. Verificamos si el usuario está autenticado en este momento.
    const isAuthenticated = !!Cookie.get('token');

    // 3. Determinamos qué endpoint de la API usar.
    const endpointUrl = isAuthenticated
      ? endPoints.orders.deleteItem(itemToDeleteId)
      : endPoints.orders.deleteItemGuest(itemToDeleteId);
    
    console.log(`Intentando eliminar el ítem #${itemToDeleteId} usando la URL: ${endpointUrl}`);

    try {
      // 4. Realizamos la llamada a la API para eliminar el ítem de la base de datos.
      await axios.delete(endpointUrl);

      // 5. Si la llamada a la API fue exitosa, actualizamos el estado del frontend.
      removeFromCart(product);
      toast.success('Producto eliminado del carrito.');
      
      console.log(`Ítem #${itemToDeleteId} eliminado con éxito.`);

    } catch (error) {
      // 6. Si algo sale mal, capturamos el error y notificamos al usuario.
      console.error('Error al eliminar el ítem del carrito:', error);
      const errorMessage = error.response?.data?.message || 'No se pudo eliminar el producto del carrito.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.OrderItem}>
      <figure>
        <Image src={product?.image} width={40} height={40} alt={product?.name} />
      </figure>
      <p>{product?.name}</p>
      {/* Añadimos toFixed(2) para un formato de precio consistente */}
      {amount ? (
        <p>${product?.price?.toFixed(2)} x {amount}</p>
      ) : (
        <p>${product?.price?.toFixed(2)}</p>
      )}
      <Image
        className={`${styles['more-clickable-area']} ${styles.pointer}`} // Corregido para aplicar ambas clases
        src={close}
        alt="close"
        width={18}
        height={18}
        onClick={handleRemove} // El onClick ahora llama directamente a la función asíncrona
        aria-hidden="true"
      />
    </div>
  );
};

export default OrderItem;