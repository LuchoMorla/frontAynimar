import React, { useContext, useState } from 'react'; // Añadido useState
import AppContext from '@context/AppContext';
import Image from 'next/image';
import axios from 'axios';
import endPoints from '@services/api';
import Cookie from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import addToCartImage from '@icons/bt_add_to_cart.svg';
import addedToCartImage from '@icons/bt_added_to_cart.svg';
import styles from '@styles/ProductItem.module.scss';
import { toast } from 'react-toastify';

const ProductItem = ({ product }) => {
  const router = useRouter();
  const { state, addToCart } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el click

  // Función para usuarios logueados
  const createOrder = async () => {
    const { data } = await axios.post(endPoints.orders.postOrder);
    return data;
  };

  // Función para actualizar el estado local
  const handleClick = (item) => {
    addToCart(item);
  };

  // --- FUNCIÓN SUBMITHANDLER CORREGIDA Y ADAPTADA ---
  const submitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return; // Previene dobles clics
    setIsLoading(true);

    const userHaveToken = Cookie.get('token');
    const amount = 1; // En esta vista, la cantidad siempre es 1.

    // 1. VERIFICAMOS SI EL PRODUCTO YA ESTÁ EN EL CARRITO
    if (state.cart.some((item) => item.id === product.id)) {
      toast.info('Este producto ya está en tu carrito.');
      setIsLoading(false);
      return;
    }

    const productId = product.id;

    try {
      // 2. OBTENEMOS O CREAMOS LA ORDEN (PARA INVITADO O USUARIO)
      let orderId = window.localStorage.getItem('oi') ? parseInt(window.localStorage.getItem('oi')) : null;

      if (!orderId) {
        if (userHaveToken) {
          const newOrder = await createOrder();
          orderId = newOrder.id;
        } else {
          const { data } = await axios.post(endPoints.orders.postGuestOrder);
          orderId = data.id;
        }
        window.localStorage.setItem('oi', `${orderId}`);
      }

      // 3. PREPARAMOS Y ENVIAMOS EL PAQUETE A LA API
      const packet = {
        orderId,
        productId,
        amount,
      };

      let newItemFromApi;
      if (userHaveToken) {
        const { data } = await axios.post(endPoints.orders.postItem, packet);
        newItemFromApi = data;
      } else {
        const { data } = await axios.post(endPoints.orders.postItemToGuest, packet);
        newItemFromApi = data;
      }

      // 4. CONSTRUIMOS EL OBJETO CORRECTO PARA EL ESTADO LOCAL
      const itemToAdd = {
        ...product,
        OrderProduct: {
          id: newItemFromApi.id, // ¡El ID de la BD que faltaba!
          amount: newItemFromApi.amount,
          orderId: newItemFromApi.orderId,
          productId: newItemFromApi.productId,
        },
      };

      // 5. ACTUALIZAMOS EL ESTADO Y NOTIFICAMOS
      handleClick(itemToAdd);
      toast.success('Producto agregado al carrito');

    } catch (err) {
      console.error("Error al agregar producto desde ProductItem:", err);
      const errorMessage = err.response?.data?.message || 'Error al agregar el producto.';
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        Cookie.remove('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false); // Reactivamos el botón
    }
  };

  return (
    <div className={styles.ProductItem}>
      <Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
        <Image src={product.image} width={240} height={240} alt={product.name} priority={false} />
      </Link>
      <div className={styles['product-info']}>
        <div>
          <p>${product.price.toFixed(2)}</p>
          <Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
            <p className={styles.productName}>{product.name}</p>
          </Link>
        </div>
        {/* Usamos un botón simple en lugar de un formulario, ya que la cantidad es fija */}
        <figure className={styles['more-clickable-area']} onClick={submitHandler} aria-hidden="true">
          {isLoading ? (
            // Opcional: mostrar un pequeño spinner o simplemente deshabilitar visualmente
            <Image className={`${styles.disabled} ${styles['add-to-cart-btn']}`} src={addedToCartImage} alt="agregando..." />
          ) : state.cart.some((item) => item.id === product.id) ? (
            <Image className={`${styles.disabled} ${styles['add-to-cart-btn']}`} src={addedToCartImage} alt="added to cart" />
          ) : (
            <Image src={addToCartImage} alt="add to cart" />
          )}
        </figure>
      </div>
    </div>
  );
};

ProductItem.displayName = 'ProductItem';

export default ProductItem;