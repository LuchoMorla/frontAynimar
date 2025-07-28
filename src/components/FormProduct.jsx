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
    console.log('sumbitHandler');
    event.preventDefault();
    const userHaveToken = Cookie.get('token');
    console.log('userHAveToken: ', userHaveToken);
    if (!userHaveToken) {
      toast.error('Para realizar esta accion necesitas Iniciar Sesion');
      /* alert ('para realizar esta accion necesitas iniciar sesion'); */
      router.push('/login');
      return;
    }

    const formData = new FormData(formRef.current);
    const amount = parseInt(formData.get('amount'));
    console.log('amount: ', amount);
    if (product.stock !== null && product.stock - amount < 0) {
      console.log('se activo funcion de validacion de productos en stock');
      toast.error('No hay suficiente stock para agregar esa cantidad al carrito');
      return;
    }

    // Verificar si el producto ya está en el carrito
    console.log('verificaremos si el producto esta en el carrito');
    const productInCart = state.cart.find(item => item.id === product.id);
    console.log(productInCart);
    if (productInCart) {
      console.log('muy bien se le agrego un warming que valida si ya esta este producto, 10, aqui si se activo');
      toast.warning('Este producto ya está en tu carrito. Puedes modificar la cantidad en la página de checkout.');
      return;
    }
    console.log('OrderProduct va a ser alterado', product.OrderProduct);
    console.log('futuro: ', amount);
    // Asignar OrderProduct para compatibilidad con el carrito
    product.OrderProduct = { amount: amount };
    
    console.log('OrderProduct fue alterado, según por compatibilidad con el carrito, ojo :)');
    console.log('orderProduct fue alterado', product.OrderProduct);
    const addToPacket = async (orderId) => {
      console.log('addTo Packet');
      const packet = {
        orderId: orderId,
        productId: product.id,
        amount: amount
      };
      console.log(packet);

      const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };

      const addProductToThePacked = await axios.post(endPoints.orders.postItem, packet, config);
      console.log(addProductToThePacked);
      return addProductToThePacked;
    };

    try {
      console.log('TryCatch SubmitHandler');
      const savedOrderId = window.localStorage.getItem('oi');
      console.log('savedOrderId:', savedOrderId);
      let orderId;
      
      if (savedOrderId == null) {
        console.log('entramos a validacion de null Order ID');
        const getOrder = await createOrder();
        console.log('creamos order ID que no habia');
        orderId = getOrder.id;
        console.log('habemusOrder Id');
        window.localStorage.setItem('oi', `${orderId}`);
        console.log('guardamos OrderId: ', orderId);
      } else {
        console.log('si teniamos order ID: ', savedOrderId);
        orderId = parseInt(savedOrderId);
      }
      console.log('vamos agregar al packet');
      await addToPacket(orderId);
      console.log('packeted');
      handleClick(product);
      console.log('handleClickDone');
      toast.success(`Producto agregado al carrito correctamente (${amount} unidades)`);
      console.log('Toastify and reload');
      router.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('error 401');
        toast.error('Necesitas iniciar sesion de nuevo');
      } else if (err.response) {
        console.log('errror en response');
        toast.error('Algo salio mal: ' + err.response.status);
      } else {
        console.log('otra clase de error');
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
