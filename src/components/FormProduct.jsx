import React, { useContext, useRef } from 'react';
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
      toast.error('Para realizar esta accion necesitas Iniciar Sesion');
      /* alert('para realizar esta accion necesitas iniciar sesion'); */
      router.push('/login');
    }

    const addToPacket = async (orderId) => {
      const formData = new FormData(formRef.current);
      const packet = {
        orderId: orderId,
        productId: product.id,
        amount: parseInt(formData.get('amount')),
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

    const savedOrderId = window.localStorage.getItem('oi');

    if (savedOrderId == null) {
      const getOrder = await createOrder();
      const bornedOrderId = getOrder.id;
      window.localStorage.setItem('oi', `${bornedOrderId}`);

      handleClick(product);
      addToPacket(bornedOrderId)
        .then(() => {
          toast.success('Producto agregado corrrectamente');
          router.reload();
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            toast.error('Necesitas iniciar sesion de nuevo'); /* 
					window.alert('Probablemente necesites iniciar sesion de nuevo'); */
          } else if (err.response) {
            toast.error('Algo salio mal: ' + err.response.status);
          }
        });
    } else {
      handleClick(product);
      const numberOrderId = parseInt(savedOrderId);
      addToPacket(numberOrderId)
        .then(() => {
          toast.success('Producto agregado corrrectamente');
          router.reload();
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            toast.error('Necesitas iniciar sesion de nuevo'); /* 
					window.alert('Probablemente necesites iniciar sesion de nuevo'); */
          } else if (err.response) {
            toast.error('Algo salio mal: ' + err.response.status);
          }
        });
    }
  };

  //un useEfect conectado a state.cart, no estaria nada mál ;) o a la peticion para que cambie el loguito

  return (
    <>
      <div className={styles['stand_container']}>
        {product?.image && <Image src={product?.image} width={300} height={300} alt={product?.name} className={styles.image} />}
        <div className={styles.ProductInfo}>
          <form ref={formRef} onSubmit={submitHandler}>
            <p className={styles.price}>${product?.price}</p>
            <p>{product?.name}</p>
            {product?.stock === null ? <></> : product?.stock === 0 ? <p className={`${styles['out-of-stock']} !text-lg !font-bold`}>Producto agotado</p> : <p>Disponible</p>}
            <p className={styles.description}>{product?.description}</p>
            <label htmlFor="amount">cantidad: </label>
            <input type="number" id="amount" name="amount" min={1} required />
            <button type="submit" className={(styles['primary-button'], styles['add-to-cart-button'])}>
              {/*
					parece que es valida si fue true
					 */}
              {state.cart.includes(product) ? (
                <Image className={(styles.disabled, styles['add-to-cart-btn'])} src={addedToCartImage} alt="added to cart" />
              ) : (
                <Image src={addToCartImage} width={24} height={24} alt="add to cart" />
              )}
              Agrega al carrito
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default ProductInfo;
