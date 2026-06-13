import React, { useState } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import styles from '@styles/CouponInput.module.scss';

/**
 * CouponInput — lets the buyer enter a discount coupon code before paying.
 *
 * Props
 * ─────
 * cartTotal      Current cart total without IVA.
 * businessId     Optional business ID to scope coupon lookup.
 * onApply        Called with { discount, code } when a coupon is successfully applied.
 * onClear        Called when the coupon is removed.
 */
const CouponInput = ({ cartTotal = 0, businessId = null, onApply, onClear }) => {
  const [code, setCode]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [applied, setApplied]     = useState(null);
  const [error, setError]         = useState('');

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError('Ingresa un código de cupón.'); return; }

    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(endPoints.coupons.validate, {
        code:       trimmed,
        cartTotal,
        businessId: businessId ?? null,
      });
      setApplied(data);
      if (typeof onApply === 'function') onApply({ discount: data.discount, code: data.code });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Cupón no válido. Verifica el código e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setApplied(null);
    setCode('');
    setError('');
    if (typeof onClear === 'function') onClear();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleApply(); }
  };

  if (applied) {
    return (
      <div className={styles.appliedPanel} role="status">
        <div className={styles.appliedHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon} viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
          <span className={styles.appliedTitle}>Cupón aplicado</span>
        </div>
        <div className={styles.appliedBody}>
          <span className={styles.appliedCode}>{applied.code}</span>
          <span className={styles.appliedDiscount}>
            −${applied.discount.toFixed(2)}
            <span className={styles.appliedHint}>
              {applied.type === 'PERCENTAGE' ? ` (${applied.value}%)` : ' de descuento'}
            </span>
          </span>
        </div>
        <button type="button" onClick={handleClear} className={styles.clearBtn}>
          Quitar cupón
        </button>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <p className={styles.label}>¿Tienes un cupón de descuento?</p>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder="ej: QUITO20"
          maxLength={50}
          className={styles.input}
          aria-label="Código de cupón"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className={styles.applyBtn}
        >
          {loading ? '...' : 'Aplicar'}
        </button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
};

export default CouponInput;
