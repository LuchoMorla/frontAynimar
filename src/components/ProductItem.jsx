import React, { useContext, useRef } from 'react';
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

const ProductItem = ({ product }) => {
  const router = useRouter();

  const { state, addToCart } = useContext(AppContext);
  const formRef = useRef(null);

  const createOrder = async () => {
    const post = await axios.post(endPoints.orders.postOrder);
    return post.data;
  };

  const handleClick = (item) => {
    addToCart(item);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const userHaveToken = Cookie.get('token');
    if (!userHaveToken) {
      alert('Para realizar esta acción necesitas iniciar sesión');
      router.push('/login');
      return;
    }
    
    // Verificar si el producto ya está en el carrito
    if (state.cart.some(item => item.id === product.id)) {
      alert('Este producto ya está en tu carrito');
      return;
    }
    
    // Asignar OrderProduct para compatibilidad con el carrito
    product.OrderProduct = { amount: 1 };
    
    const addToPacket = async (orderId) => {
      const packet = {
        orderId: orderId,
        productId: product.id,
        amount: 1
      };

      const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };

      const addProductToThePacked = await axios.post(endPoints.orders.postItem, packet, config);
      return addProductToThePacked;
    };

    try {
      const savedOrderId = window.localStorage.getItem('oi');
      let orderId;
      
      if (savedOrderId == null) {
        const getOrder = await createOrder();
        orderId = getOrder.id;
        window.localStorage.setItem('oi', `${orderId}`);
      } else {
        orderId = parseInt(savedOrderId);
      }
      
      await addToPacket(orderId);
      handleClick(product);
      alert('Producto agregado al carrito correctamente');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Probablemente necesites iniciar sesión de nuevo');
        router.push('/login');
      } else if (err.response) {
        alert('Algo salió mal: ' + err.response.status);
      } else {
        alert('Error al agregar el producto al carrito');
      }
    }
  };

  return (
    <div className={styles.ProductItem}>
      <Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
        <Image src={product.image} width={240} height={240} alt={product.description} />
      </Link>
      <div className={styles['product-info']}>
        <div>
          <p>${product.price}</p>
          <Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
            <p className={styles.productName}>{product.name}</p>
          </Link>
        </div>
        <form ref={formRef} onSubmit={submitHandler}>
          <input type="hidden" id="amount" name="amount" value="1" min={1} required />
          {/* podriamos usar cambios de estado */}
          <button type="submit" className={(styles['primary-button'], styles['add-to-cart-button'])}>
            <figure className={styles['more-clickable-area']} aria-hidden="true">
              {state.cart.includes(product) ? (
                <Image className={`${styles.disabled} ${styles['add-to-cart-btn']}`} src={addedToCartImage} alt="added to cart" />
              ) : (
                <Image src={addToCartImage} /* width={24} height={24} */ alt="add to cart" />
              )}
            </figure>
          </button>
        </form>
      </div>
    </div>
  );
};
ProductItem.displayName = 'ProductItem';

export default ProductItem;
