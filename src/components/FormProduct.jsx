import React, { useContext, useRef, useState } from 'react'; // Añadido useState para manejar el estado de carga
import AppContext from '@context/AppContext';
import axios from 'axios';
import Cookie from 'js-cookie';
import endPoints from '@services/api';
import Image from 'next/image';
import addToCartImage from '@icons/bt_add_to_cart.svg';
import addedToCartImage from '@icons/bt_added_to_cart.svg';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '@styles/ProductInfo.module.scss';

const ProductInfo = ({ product }) => {
  const router = useRouter();
  const { state, addToCart } = useContext(AppContext);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para deshabilitar el botón

  const createOrder = async () => {
    const response = await axios.post(endPoints.orders.postOrder);
    return response.data;
  };

  const handleClick = (item) => {
    addToCart(item);
  };

  // --- FUNCIÓN SUBMITHANDLER CORREGIDA ---
  const submitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return; // Evita dobles clics si ya se está procesando
    setIsLoading(true); // Deshabilita el botón

    const userHaveToken = Cookie.get('token');
    const formData = new FormData(formRef.current);
    const amount = parseInt(formData.get('amount'));

    // ... (validaciones)
    if (product.stock !== null && product.stock - amount < 0) {
      toast.error('No hay suficiente stock para agregar esa cantidad al carrito');
      setIsLoading(false); // Reactiva el botón
      return;
    }
    const productInCart = state.cart.find((item) => item.id === product.id);
    if (productInCart) {
      toast.warning('Este producto ya está en tu carrito.');
      setIsLoading(false);
      return;
    }

    const productId = product.id;

    try {
      let orderId = window.localStorage.getItem('oi') ? parseInt(window.localStorage.getItem('oi')) : null;

      if (!orderId) {
        if (userHaveToken) {
          const newOrder = await createOrder();
          orderId = newOrder.id;
        } else {
          const response = await axios.post(endPoints.orders.postGuestOrder);
          orderId = response.data.id;
        }
        window.localStorage.setItem('oi', `${orderId}`);
      }

      const packet = {
        orderId: orderId,
        productId: productId,
        amount: amount,
      };

      let newItemFromApi;
      if (userHaveToken) {
        // CAPTURAMOS LA RESPUESTA DE LA API
        const response = await axios.post(endPoints.orders.postItem, packet);
        newItemFromApi = response.data;
      } else {
        const response = await axios.post(endPoints.orders.postItemToGuest, packet);
        newItemFromApi = response.data;
      }

      // CONSTRUIMOS EL OBJETO CORRECTO USANDO LA RESPUESTA
      const itemToAdd = {
        ...product, // Copia datos del producto (nombre, imagen, precio...)
        OrderProduct: { // Crea el objeto de la relación con datos REALES de la API
          id: newItemFromApi.id, // <-- ¡El ID que faltaba!
          amount: newItemFromApi.amount,
          orderId: newItemFromApi.orderId,
          productId: newItemFromApi.productId,
        },
      };

      // Actualizamos el estado con el objeto completo
      handleClick(itemToAdd);

      toast.success(`Producto agregado al carrito correctamente (${amount} unidades)`);
    } catch (err) {
      console.error("Error al agregar producto al carrito:", err);
      const errorMessage = err.response?.data?.message || 'Error al agregar el producto al carrito.';
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        Cookie.remove('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false); // Reactiva el botón, tanto en éxito como en error
    }
  };

  if (!product || typeof product.price === 'undefined') {
    return <div>Cargando información del producto...</div>;
  }

  return (
    <>
      <div className={styles['stand_container']}>
        {product?.image && <Image src={product?.image} width={300} height={300} alt={product?.name} className={styles.image} />}
        <div className={styles.ProductInfo}>
          <form ref={formRef} onSubmit={submitHandler}>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <p>{product.name}</p>
            {product.stock === 0 ? (
              <p className={`${styles['out-of-stock']} !text-lg !font-bold`}>Producto agotado</p>
            ) : product.stock !== null && (
              <p className={`${styles['out-of-stock']} !text-lg !font-bold`}>Stock disponible: {product.stock} unidades</p>
            )}
            <p className={styles.description}>{product.description}</p>
            <label htmlFor="amount">cantidad: </label>
            <input type="number" id="amount" name="amount" min={1} defaultValue={1} required />
            <button type="submit" className={`${styles['primary-button']} ${styles['add-to-cart-button']}`} disabled={isLoading}>
              {state.cart.some((item) => item.id === product.id) ? (
                <Image className={`${styles.disabled} ${styles['add-to-cart-btn']}`} src={addedToCartImage} alt="added to cart" />
              ) : (
                <Image src={addToCartImage} width={24} height={24} alt="add to cart" />
              )}
              {isLoading ? 'Agregando...' : 'Agrega al carrito'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;