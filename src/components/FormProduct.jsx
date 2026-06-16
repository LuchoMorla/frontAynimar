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
import MarkdownDescription from '@components/MarkdownDescription';
import StarRating from '@components/StarRating';
import VariantSelector from '@components/VariantSelector';

// Strips dangerous elements while keeping Dropi's formatting HTML intact.
// Only removes <script>, <iframe>, event handlers, and javascript: links.
function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<(object|embed|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '');
}

const HTML_TAG_RE = /<[a-z][\s\S]*?>/i;

function ProductDescription({ text, styles }) {
  if (!text) return null;
  const trimmed = text.trim();
  if (trimmed.startsWith('##')) return <MarkdownDescription text={trimmed} />;
  if (HTML_TAG_RE.test(trimmed)) {
    return (
      <div
        className={styles.dropiDescription}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(trimmed) }}
      />
    );
  }
  return <p className={styles.description}>{trimmed}</p>;
}

const ProductInfo = ({ product }) => {
  const router = useRouter();
  const { state, addToCart } = useContext(AppContext);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeImages, setActiveImages] = useState(null);
  const [variantStock, setVariantStock] = useState(null);
  const [selectedDropiId, setSelectedDropiId] = useState(null);

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

  // Parse dropiItems for bundle/variant mode
  const dropiItems = useMemo(() => {
    if (!Array.isArray(product?.dropiItems)) return [];
    return product.dropiItems;
  }, [product?.dropiItems]);

  const isBundle      = product?.isBundle === true;
  const hasDropiVariants = !isBundle && dropiItems.length > 1;

  const handleVariantChange = (option, value) => {
    setSelectedVariants((prev) => ({ ...prev, [option]: value }));
  };

  const handleVariantData = (option, variantObj) => {
    // If the variant has its own image, move it to the front of the gallery
    if (variantObj?.image) {
      const base = productImages.filter((u) => u !== variantObj.image);
      setActiveImages([variantObj.image, ...base]);
    } else {
      setActiveImages(null);
    }
    // Track variant-level stock for the stock display
    setVariantStock(variantObj?.stock ?? null);
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

    // Require variant selection for variant products
    if (hasDropiVariants && !selectedDropiId) {
      toast.warning('Por favor, selecciona una variante antes de agregar al carrito.');
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
      if (selectedDropiId) packet.selectedDropiId = selectedDropiId;

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

  const displayImages = activeImages ?? productImages;
  const displayStock  = variantStock ?? product.stock;
  const isOutOfStock  = displayStock === 0;
  const showGallery   = displayImages.length > 0 && Boolean(product.images || activeImages);

  return (
    <div className={styles['stand_container']}>
      {/* Image area: gallery for multi-image products, legacy single image otherwise */}
      {showGallery ? (
        <ProductGallery images={displayImages} name={product.name} />
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

        {/* Stock status — shows variant-level stock when a variant is selected */}
        {isOutOfStock ? (
          <p className={styles.outOfStock}>Producto agotado</p>
        ) : displayStock !== null ? (
          <p className={styles.stockBadge}>
            <span className={styles.stockDot} />
            Stock disponible: <strong>{displayStock}</strong> unidades
            {variantStock !== null && <span className={styles.variantLabel}> · esta variante</span>}
          </p>
        ) : null}

        {/* Extended: variant selector for Dropi/Effi products */}
        <VariantSelector
          variants={productVariants}
          selected={selectedVariants}
          onChange={handleVariantChange}
          onVariantData={handleVariantData}
        />

        {/* Description: Markdown (AI copy) → MarkdownDescription;
            HTML (Dropi) → sanitized dangerouslySetInnerHTML;
            plain text → <p> */}
        {product.description && <ProductDescription text={product.description} styles={styles} />}

        {/* ── Dropi Variant Selector ──────────────────────────────────────── */}
        {hasDropiVariants && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
              Selecciona una variante:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {dropiItems.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedDropiId(v.id)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: '2px solid',
                    borderColor: selectedDropiId === v.id ? '#7c3aed' : '#d1d5db',
                    background: selectedDropiId === v.id ? '#ede9fe' : '#fff',
                    color: selectedDropiId === v.id ? '#5b21b6' : '#374151',
                    fontWeight: selectedDropiId === v.id ? 700 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {v.value || v.id}
                </button>
              ))}
            </div>
            {!selectedDropiId && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem' }}>
                Debes seleccionar una variante para continuar.
              </p>
            )}
          </div>
        )}

        {/* ── Bundle Pack Summary ─────────────────────────────────────────── */}
        {isBundle && dropiItems.length > 0 && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            background: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '8px',
          }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', marginBottom: '0.4rem' }}>
              Pack incluye:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {dropiItems.map((v, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: '#78350f' }}>
                  {v.qty && v.qty > 1 ? `${v.qty}× ` : ''}{v.value || `Componente ${i + 1}`}
                </li>
              ))}
            </ul>
          </div>
        )}

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
