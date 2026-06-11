import React, { useContext, useMemo, useRef, useState } from 'react';
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
import ProductGallery from '@components/ProductGallery';
import StarRating from '@components/StarRating';
import VariantSelector from '@components/VariantSelector';

const ProductInfo = ({ product }) => {
  const router = useRouter();
  const { state, addToCart } = useContext(AppContext);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Parse images array from JSON text (Phase 2 products from Dropi/Effi).
  // Falls back to the legacy single-image string for old products.
  const productImages = useMemo(() => {
    try {
      if (product?.images) {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) { /* invalid JSON — return fallback */ }
    return product?.image ? [product.image] : [];
  }, [product?.images, product?.image]);

  // Parse variants JSON if present (Dropi/Effi products only)
  const productVariants = useMemo(() => {
    try {
      if (product?.variants) {
        const parsed = typeof product.variants === 'string'
          ? JSON.parse(product.variants)
          : product.variants;
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) { /* invalid JSON — return fallback */ }
    return [];
  }, [product?.variants]);

  const handleVariantChange = (option, value) => {
    setSelectedVariants((prev) => ({ ...prev, [option]: value }));
  };

  const createOrder = async () => {
    const response = await axios.post(endPoints.orders.postOrder);
    return response.data;
  };

  const handleClick = (item) => {
    addToCart(item);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const userHaveToken = Cookie.get('token');
    const formData = new FormData(formRef.current);
    const amount = parseInt(formData.get('amount'));

    if (product.stock !== null && product.stock - amount < 0) {
      toast.error('No hay suficiente stock para agregar esa cantidad al carrito');
      setIsLoading(false);
      return;
    }
    const productInCart = state.cart.find((item) => item.id === product.id);
    if (productInCart) {
      toast.warning('Este producto ya está en tu carrito.');
      setIsLoading(false);
      return;
    }

    const productId = product.id;

    try {
      let orderId = window.localStorage.getItem('oi')
        ? parseInt(window.localStorage.getItem('oi'))
        : null;

      if (!orderId) {
        if (userHaveToken) {
          const newOrder = await createOrder();
          orderId = newOrder.id;
        } else {
          const response = await axios.post(endPoints.orders.postGuestOrder);
          orderId = response.data.id;
        }
        window.localStorage.setItem('oi', `${orderId}`);
      }

      const packet = { orderId, productId, amount };

      let newItemFromApi;
      if (userHaveToken) {
        const response = await axios.post(endPoints.orders.postItem, packet);
        newItemFromApi = response.data;
      } else {
        const response = await axios.post(endPoints.orders.postItemToGuest, packet);
        newItemFromApi = response.data;
      }

      const itemToAdd = {
        ...product,
        OrderProduct: {
          id: newItemFromApi.id,
          amount: newItemFromApi.amount,
          orderId: newItemFromApi.orderId,
          productId: newItemFromApi.productId,
        },
      };

      handleClick(itemToAdd);
      toast.success(`Producto agregado al carrito correctamente (${amount} unidades)`);
    } catch (err) {
      console.error('Error al agregar producto al carrito:', err);
      const errorMessage = err.response?.data?.message || 'Error al agregar el producto al carrito.';
      toast.error(errorMessage);
      if (err.response?.status === 401) {
        Cookie.remove('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!product || typeof product.price === 'undefined') {
    return <div>Cargando información del producto...</div>;
  }

  const isOutOfStock = product.stock === 0;
  // Use the multi-image gallery only for products that have the images field
  // (Phase 2 sync). Old products with only product.image use the original display.
  const showGallery = Boolean(product.images) && productImages.length > 0;

  return (
    <div className={styles['stand_container']}>
      {/* Image area: gallery for multi-image products, legacy single image otherwise */}
      {showGallery ? (
        <ProductGallery images={productImages} name={product.name} />
      ) : (
        product?.image && (
          <Image
            src={product.image}
            width={300}
            height={300}
            alt={product.name}
            className={styles.image}
          />
        )
      )}

      <div className={styles.ProductInfo}>
        {/*
          p element order is preserved to keep .ProductInfo p:nth-child selectors
          working for both FormProduct and FormProductG.
          nth-child(1) → price, nth-child(2) → name.
          Named classes override positional styles where needed via !important.
        */}
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        <p className={styles.productName}>{product.name}</p>

        {/* Extended: star rating inserted after name, doesn't break nth-child counting */}
        <StarRating rating={product.rating ?? 0} count={product.reviewCount ?? null} />

        {/* Stock status */}
        {isOutOfStock ? (
          <p className={styles.outOfStock}>Producto agotado</p>
        ) : product.stock !== null ? (
          <p className={styles.stockBadge}>
            <span className={styles.stockDot} />
            Stock disponible: <strong>{product.stock}</strong> unidades
          </p>
        ) : null}

        {/* Extended: variant selector for Dropi/Effi products */}
        <VariantSelector
          variants={productVariants}
          selected={selectedVariants}
          onChange={handleVariantChange}
        />

        <p className={styles.description}>{product.description}</p>

        <form ref={formRef} onSubmit={submitHandler}>
          <label htmlFor="amount" className={styles.amountLabel}>Cantidad:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min={1}
            max={product.stock ?? undefined}
            defaultValue={1}
            required
            className={styles.amountInput}
            disabled={isOutOfStock}
          />
          <button
            type="submit"
            className={`${styles['primary-button']} ${styles['add-to-cart-button']}`}
            disabled={isLoading || isOutOfStock}
          >
            {state.cart.some((item) => item.id === product.id) ? (
              <Image src={addedToCartImage} alt="added to cart" width={24} height={24} />
            ) : (
              <Image src={addToCartImage} width={24} height={24} alt="add to cart" />
            )}
            {isLoading ? 'Agregando...' : 'Agrega al carrito'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductInfo;
