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
      return;
    }

    const formData = new FormData(formRef.current);
    const amount = parseInt(formData.get('amount'));

    if (product.stock !== null && product.stock - amount < 0) {
      toast.error('No hay suficiente stock para agregar esa cantidad al carrito');
      return;
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = state.cart.find(item => item.id === product.id);
    if (productInCart) {
      toast.warning('Este producto ya está en tu carrito. Puedes modificar la cantidad en la página de checkout.');
      return;
    }

    // Asignar OrderProduct para compatibilidad con el carrito
    product.OrderProduct = { amount: amount };

    const addToPacket = async (orderId) => {
      const packet = {
        orderId: orderId,
        productId: product.id,
        amount: amount
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
      toast.success(`Producto agregado al carrito correctamente (${amount} unidades)`);
      router.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Necesitas iniciar sesion de nuevo');
      } else if (err.response) {
        toast.error('Algo salio mal: ' + err.response.status);
      } else {
        toast.error('Error al agregar el producto al carrito');
      }
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
            {product?.stock === null ? (
              <></>
            ) : product?.stock === 0 ? (
              <p className={`${styles['out-of-stock']} !text-lg !font-bold`}>Producto agotado</p>
            ) : (
              <p className={`${styles['out-of-stock']} !text-lg !font-bold`}>Stock disponible: {product.stock} unidades</p>
            )}
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
