import React, { useContext, /* useEffect, */ useRef, useState } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png';
import endPoints from '@services/api';
import actualizarImg from '@icons/button_refresh_15001.png';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@styles/CheckoutOrderItem.module.scss';

const CheckoutOrderItem = ({ product }) => {
  /* 
	const { state } = useContext(AppContext); */
  const [buttonOpen, setUpdateButton] = useState(false);
  const [dataAmount, setChangeDataAmount] = useState({});
  const { removeFromCart } = useContext(AppContext);
  /* 	const handleRemove = product => {
		removeFromCart(product);
	}; */

   const router = useRouter();

  const inputRef = useRef(null),
    divRef = useRef(null);

  const actualizarCantidad = async (data) => {
    console.log('entro a actualizar cantidad fuera del try y catch');
    console.log('¿por que no recibo order ID?');
    console.log(data);
    console.log('¿por que no recibo order ID?');
    try {
      console.log('entramos al trycacth y empiezan las validaciones de este wevon');
      // Validar que la cantidad sea mayor que 0
      if (data.amount <= 0) {
        alert('La cantidad debe ser mayor que 0');
        return;
      }
      
      if (product.stock !== null && data.amount > product.stock) {
        alert(`No hay suficiente stock para agregar esa cantidad al carrito. Intenta con una cantidad menor a ${product.stock}`);
        return;
      }
      console.log('validacion que habia antes tambien termino');
      const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
      const { amount, productId, orderId } = data;
      console.log('ChackoutOrderItem', data);
      const body = {
        amount: amount,
        productId: productId,
        orderId: orderId,
      };
      console.log('body');
      console.log(body);
      const id = data.itemId;
      console.log('Id de la orden que sera editada', id);
      const { data: update } = await axios.patch(endPoints.orders.editItem(id), body, config);

      console.log('edicion resultado', update);
      setUpdateButton(false);
      return update;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  };

  const changeAmountOfItem = (product) => {
    console.group('funcion changeAmountOfItem');
    console.log('parametro product:', product);
    console.log(product);
    let amountInt = inputRef.current.value;
    console.log('let amountInt');
    // Validar que la cantidad sea un número válido
    if (isNaN(parseInt(amountInt)) || parseInt(amountInt) <= 0) {
      alert('Por favor ingrese una cantidad válida mayor a 0');
      return;
    }
    
    const orderProduct = product.OrderProduct;
    console.log('const orderProduct', orderProduct);
    console.log('orderProductId: ', orderProduct.id);
    if (!orderProduct) {
      console.log('no se encontro orderProduct');
      alert('No se encontró información del producto en la orden');
      return;
    }
    console.log('otro atributo que viene null: es el id de orderProduct');
    const itemId = orderProduct.id;
    console.log(itemId);
    console.log('por que viene null?');
    const data = {
      itemId: itemId, //sale null
      amount: amountInt ? parseInt(amountInt) : 0,
      productId: product.id,
      orderId: orderProduct.orderId, //sale null
    };  
    console.log(itemId);
    console.log(data);

    product.OrderProduct.amount = amountInt;
    setChangeDataAmount(data);
    setUpdateButton(true);
    console.log('datos fueron cambiados');
    console.groupEnd('funcion changeAmountOfItem');
  };

  const removeItemProduct = async (item) => {
    try {
    console.group('removeItemProduct');
      const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
    
      const deleteItem = await axios.delete(endPoints.orders.deleteItem(item), config);
      console.log(deleteItem);
      console.log(deleteItem.data);
    console.groupEnd('removeItemProduct');
      return deleteItem.data;
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  };

  const handleRemove = (product) => {
    console.group('handeRemove');
    console.log('entra en la funcion: ', product);
    try {
      console.log('dentro del tycath, apunto de correr la otra funcion');
      removeFromCart(product);
      console.log('removimos de la parte visual');
/* 
      if (!product.OrderProduct || !product.OrderProduct.id) {
        console.log('se abrio la funcion al retornar nada se cierra la funcion, puede que haya sido causada de adrede por ese wevon');
        console.error('No se encontró ID del producto en la orden');
        return;
        console.log('como no quiero que se active eso, voy a cerrar la funcion sin return por ahora'); 
      }
*/
      console.log('continuamos fuera de esa validacion trampa, que hay que borrar');

      const orderProductId = product.OrderProduct.id;

      console.log('orderProductId', orderProductId);
      console.log('declaramos peticion');
      removeItemProduct(orderProductId)
        .then(() => {
          console.log('Promesa cumplio con la mision');
          alert('Producto eliminado del carrito correctamente');
        })
        .catch((err) => {
          console.log('promesa dio error');
          console.error('Error al eliminar el producto:', err);
          alert('Error al eliminar el producto del carrito');
        });
      console.log('terminamos de procesar la declaracion');
    console.groupEnd('handeRemove');
    } catch (error) {
      console.log('catchiamos un error en la funcion remove item');
      alert('Error al procesar la solicitud');
      console.error(error);
    }
  };

  return (
    <tr className={styles.OrderItem}>
      <td>
        <figure>
          <Image src={product?.image} width={30} height={30} alt={product?.title} />
        </figure>
      </td>
      <td>
        <p>{product?.name}</p>
      </td>
      <td>
        <div ref={divRef} onChange={() => changeAmountOfItem(product)} className={styles.amountContainer}>
          <label htmlFor="amountChanged" className={styles.label}>
            Cantidad:
          </label>
          {/* <input ref={inputRef} type="number" id="amountChanged" name="amountChanged" className={styles.inputAmount} defaultValue={product?.OrderProduct.amount} /> */}
          <input
            ref={inputRef}
            type="number"
            id="amountChanged"
            name="amountChanged"
            className={styles.inputAmount}
            defaultValue={product?.OrderProduct?.amount || router.reload()}
            max={product.stock ?? 999}
          />

          {buttonOpen == true ? (
            <button className={styles.updateButton} onClick={() => actualizarCantidad(dataAmount)}>
              <Image src={actualizarImg} width={25} height={25} alt="Actualizar cantidad | update amount" />
              Aplicar Cambios
            </button>
          ) : null}
        </div>
      </td>
      <td>
        <p>
          {screen.width <= 660 ? `P/u ` : `Precio/unidad `}${product?.price.toFixed(2)}
        </p>
      </td>
      <td>
        <p>${(product?.price * (product?.OrderProduct?.amount ? product?.OrderProduct?.amount : 0)).toFixed(2)}</p>
      </td>
      <td>
        <Image className={styles['more-clickable-area']} src={close} alt="close" width={20} height={20} onClick={() => handleRemove(product)} />
      </td>
    </tr>
  );
};

export default CheckoutOrderItem;
