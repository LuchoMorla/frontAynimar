import React, { useContext } from 'react';
import OrderItem from '@components/OrderItem';
import AppContext from '@context/AppContext';
import Link from 'next/link';
import styles from '@styles/MyOrder.module.scss';

const MyOrder = () => {
  const { state, toggleOrder } = useContext(AppContext);

  const sumTotal = () =>
    state.cart
      .reduce((acc, item) => {
        const amt = item?.OrderProduct?.amount ?? 1;
        return acc + (item?.price ?? 0) * amt;
      }, 0)
      .toFixed(2);

  const itemCount = state.cart.reduce(
    (acc, item) => acc + (item?.OrderProduct?.amount ?? 1),
    0
  );

  return (
    <>
      <div className={styles.overlay} onClick={toggleOrder} aria-hidden="true" />

      <aside className={styles.drawer} aria-label="Carrito de compras">
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerLeft}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.cartIcon}>
              <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM5.14 6H3V4H1v2h2l3.6 7.59L5.25 16c-.16.28-.25.61-.25.94C5 18.1 5.9 19 7 19h14v-2H7.42a.25.25 0 01-.25-.25l.03-.12.97-1.63H19c.75 0 1.41-.41 1.75-1.03L23 9.54l-1.73-1-2.25 3.86L5.14 6z"/>
            </svg>
            <h2 className={styles.title}>
              Tu Carrito
              {itemCount > 0 && (
                <span className={styles.countBadge}>{itemCount}</span>
              )}
            </h2>
          </div>
          <button className={styles.closeBtn} onClick={toggleOrder} aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* COD strip */}
        <div className={styles.codStrip}>
          <span>💵</span>
          <span>Pago Contra Entrega disponible — pagas al recibir</span>
        </div>

        {/* Items */}
        <div className={styles.itemsList}>
          {state.cart.length > 0 ? (
            state.cart.map((product) => (
              <OrderItem product={product} key={`orderItem-${product.id}`} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p className={styles.emptyTitle}>Tu carrito está vacío</p>
              <p className={styles.emptyDesc}>Agrega productos para comenzar</p>
              <button className={styles.exploreBtn} onClick={toggleOrder}>
                Explorar productos
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.trustBar}>
              <div className={styles.trustItem}>
                <span>🚚</span>
                <span>Envíos seguros a todo Ecuador</span>
              </div>
              <div className={styles.trustItem}>
                <span>🛡️</span>
                <span>Garantía de satisfacción Aynimar</span>
              </div>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>
                Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
              </span>
              <span className={styles.totalAmount}>${sumTotal()}</span>
            </div>

            <Link href="/checkout" className={styles.ctaButton} onClick={toggleOrder}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Finalizar compra segura
            </Link>

            <p className={styles.ecoNote}>
              🌍 Con esta compra apoyas activamente la economía circular y el reciclaje en Ecuador.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default MyOrder;
