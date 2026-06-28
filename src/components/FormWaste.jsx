import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import addToCartButton from '@icons/bt_add_to_cart.svg';
import styles from '@styles/ProductInfo.module.scss';
import { useRecycleSubmit } from '@hooks/useRecycleSubmit';

/**
 * FormWaste — presentation-only component for selling a recyclable item.
 *
 * All business logic (auth guard, payment session management, API calls,
 * error classification and Sentry reporting) lives in useRecycleSubmit.
 * This component only handles rendering, input capture and user feedback.
 */
const FormWaste = ({ product }) => {
  const router  = useRouter();
  const formRef = useRef(null);
  const { isLoading, error, success, submit, reset } = useRecycleSubmit(product);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    await submit(formData.get('amount'));
  };

  useEffect(() => {
    if (!success) return;
    toast.success(
      'Pedido registrado. Nos comunicaremos para recolectar el producto. ' +
      'Te redirigiremos para confirmar tus datos de contacto.'
    );
    router.push('/mi_cuenta/recycler');
  }, [success, router]);

  useEffect(() => {
    if (!error) return;
    toast.error(error.message);
    reset();
  }, [error, reset]);

  return (
    <div className={styles['stand_container']}>
      {product?.image && (
        <Image
          src={product.image}
          width={300}
          height={300}
          alt={product?.name}
          className={styles.image}
        />
      )}

      <div className={styles.ProductInfo}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <p>${product?.price}</p>
          <p>{product?.name}</p>
          <p>{product?.description}</p>

          <label htmlFor="amount">cantidad: </label>
          <input
            type="number"
            required
            id="amount"
            name="amount"
            min={1}
          />

          <button
            type="submit"
            className={styles['add-to-cart-button']}
            disabled={isLoading}
          >
            <Image src={addToCartButton} width={24} height={24} alt="add to cart" />
            {isLoading ? 'Enviando…' : 'Vender producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormWaste;
