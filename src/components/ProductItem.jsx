import React, { useContext, useState } from 'react';
import AppContext from '@context/AppContext';
import Image from 'next/image';
import axios from 'axios';
import endPoints from '@services/api';
import Cookie from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@styles/ProductItem.module.scss';
import { toast } from 'react-toastify';

const ProductItem = ({ product }) => {
  const router = useRouter();
  const { state, addToCart } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async () => {
    const { data } = await axios.post(endPoints.orders.postOrder);
    return data;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const userHaveToken = Cookie.get('token');
    const amount = 1;

    if (state.cart.some((item) => item.id === product.id)) {
      toast.info('Este producto ya está en tu carrito.');
      setIsLoading(false);
      return;
    }

    const productId = product.id;

    const addItemToOrder = async (orderId) => {
      const packet = { orderId, productId, amount };
      if (userHaveToken) {
        const { data } = await axios.post(endPoints.orders.postItem, packet);
        return data;
      } else {
        const { data } = await axios.post(endPoints.orders.postItemToGuest, packet);
        return data;
      }
    };

    try {
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

      let newItemFromApi;
      try {
        newItemFromApi = await addItemToOrder(orderId);
      } catch (itemErr) {
        // Stale order in localStorage — create a fresh one and retry once
        if (itemErr.response?.status === 404) {
          window.localStorage.removeItem('oi');
          if (userHaveToken) {
            const newOrder = await createOrder();
            orderId = newOrder.id;
          } else {
            const { data } = await axios.post(endPoints.orders.postGuestOrder);
            orderId = data.id;
          }
          window.localStorage.setItem('oi', `${orderId}`);
          newItemFromApi = await addItemToOrder(orderId);
        } else {
          throw itemErr;
        }
      }

      addToCart({
        ...product,
        OrderProduct: {
          id: newItemFromApi.id,
          amount: newItemFromApi.amount,
          orderId: newItemFromApi.orderId,
          productId: newItemFromApi.productId,
        },
      });
      toast.success('Producto agregado al carrito');

    } catch (err) {
      console.error('Error al agregar producto desde ProductItem:', err);
      toast.error(err.response?.data?.message || 'Error al agregar el producto.');
      if (err.response?.status === 401) {
        Cookie.remove('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = state.cart.some((item) => item.id === product.id);

  const ctaClass = [
    styles.ctaButton,
    isLoading ? styles.ctaLoading : '',
    isInCart  ? styles.ctaAdded  : '',
  ].join(' ');

  return (
    <div className={styles.ProductItem}>
      <div className={styles['image-wrapper']}>
        <Link href={`/store/${product.id}`} className={styles.go_product} passHref>
          <Image src={product.image} width={240} height={240} alt={product.name} priority={false} />
        </Link>
        <span className={styles.badge}>
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '0.7rem', height: '0.7rem', display: 'inline', marginRight: '3px', verticalAlign: 'middle' }}>
            <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 2z"/>
          </svg>
          Importado Nuevo
        </span>
      </div>

      <div className={styles['product-info']}>
        <div className={styles['product-meta']}>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <Link href={`/store/${product.id}`} className={styles.go_product} passHref>
            <p className={styles.productName}>{product.name}</p>
          </Link>
        </div>

        <button
          className={ctaClass}
          onClick={submitHandler}
          disabled={isLoading || isInCart}
          aria-label={isInCart ? 'Ya está en el carrito' : 'Agregar al carrito'}
        >
          {isLoading ? (
            'Agregando...'
          ) : isInCart ? (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0 }}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              En tu carrito
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0 }}>
                <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM7.17 14l.9-1.73-.07-.14L5.14 6H3V4H1v2h2l3.6 7.59L5.25 16c-.16.28-.25.61-.25.94C5 18.1 5.9 19 7 19h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.97-1.63H19c.75 0 1.41-.41 1.75-1.03L23 9.54l-1.73-1-2.25 3.86L7.17 14z"/>
              </svg>
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

ProductItem.displayName = 'ProductItem';

export default ProductItem;
