import React, { useContext, /* useEffect, */ useRef, useState } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import close from '@icons/icon_close.png';
import endPoints from '@services/api';
import actualizarImg from '@icons/button_refresh_15001.png';
import axios from 'axios';
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

  // const router = useRouter();

  const inputRef = useRef(null),
    divRef = useRef(null);

  const actualizarCantidad = async (data) => {
    try {
      // Validar que la cantidad sea mayor que 0
      if (data.amount <= 0) {
        alert('La cantidad debe ser mayor que 0');
        return;
      }
      
      if (product.stock !== null && data.amount > product.stock) {
        alert(`No hay suficiente stock para agregar esa cantidad al carrito. Intenta con una cantidad menor a ${product.stock}`);
        return;
      }

      const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
      const { amount, productId, orderId } = data;
      const body = {
        amount: amount,
        productId: productId,
        orderId: orderId,
      };
      const id = data.itemId;
      const { data: update } = await axios.patch(endPoints.orders.editItem(id), body, config);

      setUpdateButton(false);
      return update;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  };

  const changeAmountOfItem = (product) => {
    let amountInt = inputRef.current.value;
    
    // Validar que la cantidad sea un número válido
    if (isNaN(parseInt(amountInt)) || parseInt(amountInt) <= 0) {
      alert('Por favor ingrese una cantidad válida mayor a 0');
      return;
    }
    
    const orderProduct = product.OrderProduct;
    if (!orderProduct) {
      alert('No se encontró información del producto en la orden');
      return;
    }
    
    const itemId = orderProduct.id;
    const data = {
      itemId: itemId,
      amount: amountInt ? parseInt(amountInt) : 0,
      productId: product.id,
      orderId: orderProduct.orderId,
    };
    
    product.OrderProduct.amount = amountInt;
    setChangeDataAmount(data);
    setUpdateButton(true);
  };

  const removeItemProduct = async (item) => {
    try {
      const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
      const deleteItem = await axios.delete(endPoints.orders.deleteItem(item), config);
      return deleteItem.data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  };

  const handleRemove = (product) => {
    try {
      removeFromCart(product);
      
      if (!product.OrderProduct || !product.OrderProduct.id) {
        console.error('No se encontró ID del producto en la orden');
        return;
      }
      
      const orderProductId = product.OrderProduct.id;
      
      removeItemProduct(orderProductId)
        .then(() => {
          alert('Producto eliminado del carrito correctamente');
        })
        .catch((err) => {
          console.error('Error al eliminar el producto:', err);
          alert('Error al eliminar el producto del carrito');
        });
    } catch (error) {
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
            defaultValue={product?.OrderProduct?.amount || 1}
            min={1}
            max={product.stock || 999}
            required
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
