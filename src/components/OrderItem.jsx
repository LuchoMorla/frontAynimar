import React, { useContext, useState } from 'react';
import Image from 'next/image';
import AppContext from '@context/AppContext';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';
import endPoints from '@services/api/index';
import axios from 'axios';
import styles from '@styles/OrderItem.module.scss';

const OrderItem = ({ product, readOnly = false }) => {
  const { removeFromCart, updateCartItem } = useContext(AppContext);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const amount = product?.OrderProduct?.amount ?? 1;
  const itemId = product?.OrderProduct?.id;
  const unitPrice = product?.price ?? 0;
  const lineTotal = (unitPrice * amount).toFixed(2);

  const handleRemove = async () => {
    if (!itemId || isRemoving) return;
    setIsRemoving(true);
    try {
      const isAuthenticated = !!Cookie.get('token');
      const url = isAuthenticated
        ? endPoints.orders.deleteItem(itemId)
        : endPoints.orders.deleteItemGuest(itemId);
      await axios.delete(url);
      removeFromCart(product);
      toast.success('Producto eliminado del carrito.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo eliminar el producto.');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleQtyChange = async (delta) => {
    const newAmount = amount + delta;
    if (newAmount < 1) {
      await handleRemove();
      return;
    }
    if (!itemId || isUpdating) return;
    setIsUpdating(true);
    try {
      const isAuthenticated = !!Cookie.get('token');
      const url = isAuthenticated
        ? endPoints.orders.editItem(itemId)
        : endPoints.orders.editItemGuest(itemId);
      await axios.patch(url, { amount: newAmount });
      updateCartItem(product.id, newAmount);
    } catch (err) {
      toast.error('No se pudo actualizar la cantidad.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.OrderItem}>
      <div className={styles.imageWrap}>
        <Image
          src={product?.image}
          width={64}
          height={64}
          alt={product?.name}
          className={styles.productImage}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{product?.name}</p>
        <p className={styles.unitPrice}>${unitPrice.toFixed(2)} / unidad</p>

        <div className={styles.qtyRow}>
          {readOnly ? (
            <span className={styles.qtyDisplay}>Cantidad: {amount}</span>
          ) : (
            <div className={styles.qtyControl}>
              <button
                className={styles.qtyBtn}
                onClick={() => handleQtyChange(-1)}
                disabled={isUpdating || isRemoving}
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className={styles.qtyDisplay}>
                {isUpdating ? '···' : amount}
              </span>
              <button
                className={styles.qtyBtn}
                onClick={() => handleQtyChange(+1)}
                disabled={isUpdating || isRemoving}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          )}
          <span className={styles.lineTotal}>${lineTotal}</span>
        </div>
      </div>

      {!readOnly && (
        <button
          className={styles.removeBtn}
          onClick={handleRemove}
          disabled={isRemoving}
          aria-label="Eliminar del carrito"
        >
          {isRemoving ? (
            <span className={styles.spinner} />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default OrderItem;
