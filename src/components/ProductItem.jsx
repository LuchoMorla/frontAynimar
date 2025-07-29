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
import { toast } from 'react-toastify';

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
      toast.warning('Para realizar esta acción necesitas iniciar sesión');
      router.push('/login');
      return;
    }
    
    // Verificar si el producto ya está en el carrito
    if (state.cart.some(item => item.id === product.id)) {
      console.log('el producto esta en carrito por eso se activo esta funcion, producta ponerle un tostify');
      toast.info('Este producto ya está en tu carrito');
      return;
    }
    
    // Asignar OrderProduct para compatibilidad con el carrito
    console.log('se hara una asignacion directa al valor product.OrderProduct: ', product.OrderProduct);
    product.OrderProduct = { amount: 1 };
    console.log('era directa no en objeto pero'); 
    console.log(product.OrderProduct);
    console.log('quizas solo debes hacerle asi:  product.OrderProduct = 1;');

    const addToPacket = async (orderId) => {
      console.group('addToPacket');
      const packet = {
        orderId: orderId,
        productId: product.id,
        amount: 1
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
      console.groupEnd('addToPacket');
      return addProductToThePacked;
    };

    try {
      console.log('empezamos el trycattch de productItem');
      console.log('consultamos si tenemos orderId');
      const savedOrderId = window.localStorage.getItem('oi');
      console.log(savedOrderId);
      
      console.log('HAsta aqui quedo mi logica y borrro un monton');
      let orderId; 
      console.log('inicia con let orderId');
      
      if (savedOrderId == null) {
        console.log('inicia mi funcion if');
        const getOrder = await createOrder();
        console.log('mantenemos el getOrder');
        orderId = getOrder.id;
        console.log('El hace su magia: ', orderId);
        window.localStorage.setItem('oi', `${orderId}`);
        console.log('termino su magia, comienza la mia');
        if(orderId == null){
        console.log('mi magia fue activada');
        const bornedOrderId = getOrder.id;
        window.localStorage.setItem('oi', `${bornedOrderId}`);
        console.log('termine poniendome salvaje');
        }
      } else {
        console.log('volvimos al else por que si habia savedOrderId');
        orderId = parseInt(savedOrderId);
      }
      console.log('termiamos de ver que sucedio con lo que deberia estar en localstorage');
      console.log('resulta que yo hice un if else más grande, el me lo acorto');
      await addToPacket(orderId);
      console.log('resulta que tambien cambia la forma en hacer las consultas aqui... quizas solo debamos volver a la forma en que lo haciamos antes, quizas...');
      console.log('agregamos al paquete la orden');
      handleClick(product);
      console.log('handleClick se ejecuto al final');
      toast.success('Producto agregado al carrito correctamente');
      console.log('salimos del try');
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('catch1');
        toast.warning('Probablemente necesites iniciar sesión de nuevo');
        router.push('/login');
      } else if (err.response) {
                console.log('catch2');
        toast.error('Algo salió mal: ' + err.response.status);
      } else {
                console.log('catch3');
        toast.error('Error al agregar el producto al carrito');
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
