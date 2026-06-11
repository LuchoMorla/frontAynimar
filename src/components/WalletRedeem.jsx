import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import endPoints from '@services/api';
import styles from '@styles/WalletRedeem.module.scss';

const IVA_RATE = 0.15;

/**
 * WalletRedeem — lets the authenticated user apply their green credits
 * (Huellas de Reciclaje) to the current order before payment.
 *
 * Props
 * ─────
 * subtotal        Cart total without IVA (from sumTotal()).
 * isAuthenticated Whether a logged-in session exists (boolean).
 * onCreditsChange Called with the current integer credits value every time it changes.
 */
const WalletRedeem = ({ subtotal = 0, isAuthenticated = false, onCreditsChange }) => {
  const [balance, setBalance] = useState(0);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const maxApplicable = Math.min(balance, Math.floor(subtotal));

  const subtotalAfterCredits = Math.max(0, subtotal - credits);
  const ivaAmount = parseFloat((subtotalAfterCredits * IVA_RATE).toFixed(2));
  const totalToPay = parseFloat((subtotalAfterCredits * (1 + IVA_RATE)).toFixed(2));

  const fetchBalance = useCallback(async () => {
    const token = Cookie.get('token');
    if (!token) return;
    setLoading(true);
    setFetchError(null);
    try {
      const { data } = await axios.get(endPoints.wallet.myBalance, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(data.credit ?? 0);
    } catch {
      setFetchError('No se pudo cargar tu saldo. Puedes continuar sin créditos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchBalance();
  }, [isAuthenticated, fetchBalance]);

  const applyCredits = (value) => {
    const clamped = Math.min(Math.max(0, value), maxApplicable);
    setCredits(clamped);
    if (typeof onCreditsChange === 'function') onCreditsChange(clamped);
  };

  const increment = () => applyCredits(credits + 1);
  const decrement = () => applyCredits(credits - 1);

  const handleInputChange = (e) => {
    const parsed = parseInt(e.target.value, 10);
    applyCredits(Number.isNaN(parsed) ? 0 : parsed);
  };

  if (!isAuthenticated) return null;

  return (
    <section className={styles.panel} aria-label="Billetera Verde — Huellas de Reciclaje">
      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={styles.leafIcon} aria-hidden="true">🌿</span>
        <h3 className={styles.title}>Huellas de Reciclaje</h3>
      </div>

      {/* ── Balance badge ── */}
      <div className={styles.balanceRow}>
        <span className={styles.balanceLabel}>Tu saldo disponible:</span>
        {loading ? (
          <span className={styles.balanceLoading}>Cargando…</span>
        ) : fetchError ? (
          <span className={styles.balanceError}>{fetchError}</span>
        ) : (
          <span className={styles.balanceBadge}>
            <span className={styles.balanceNum}>{balance}</span>
            <span className={styles.balanceUnit}>créditos</span>
          </span>
        )}
      </div>

      {/* ── Credits selector ── */}
      {balance > 0 && subtotal > 0 ? (
        <>
          <p className={styles.selectorLabel}>
            ¿Cuántos créditos deseas aplicar?
            <span className={styles.maxHint}> (máx. {maxApplicable})</span>
          </p>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={decrement}
              disabled={credits <= 0}
              aria-label="Restar un crédito"
            >
              −
            </button>
            <input
              type="number"
              className={styles.creditInput}
              value={credits}
              min={0}
              max={maxApplicable}
              onChange={handleInputChange}
              aria-label="Créditos a aplicar"
            />
            <button
              type="button"
              className={styles.stepBtn}
              onClick={increment}
              disabled={credits >= maxApplicable}
              aria-label="Sumar un crédito"
            >
              +
            </button>
          </div>
          {credits > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => applyCredits(0)}
            >
              Quitar créditos
            </button>
          )}
        </>
      ) : (
        !loading && balance === 0 && (
          <p className={styles.noCreditsNote}>
            Aún no tienes Huellas de Reciclaje. ¡Recicla con nosotros para ganarlas!
          </p>
        )
      )}

      {/* ── Totals breakdown ── */}
      {subtotal > 0 && (
        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}>
            <span>Subtotal del pedido</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {credits > 0 && (
            <div className={`${styles.breakdownRow} ${styles.discount}`}>
              <span>— Créditos aplicados</span>
              <span>−${credits.toFixed(2)}</span>
            </div>
          )}
          <div className={styles.breakdownRow}>
            <span>IVA (15%)</span>
            <span>${ivaAmount.toFixed(2)}</span>
          </div>
          <div className={`${styles.breakdownRow} ${styles.totalRow}`}>
            <span>Total a pagar</span>
            <span className={styles.totalAmount}>${totalToPay.toFixed(2)}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default WalletRedeem;
