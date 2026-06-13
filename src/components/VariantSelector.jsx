import React from 'react';
import styles from '@styles/VariantSelector.module.scss';

const COLOR_MAP = {
  negro: '#1a1a1a',
  blanco: '#f9fafb',
  gris: '#9ca3af',
  azul: '#3b82f6',
  morado: '#82427b',
  verde: '#a2ce92',
  rojo: '#ef4444',
  roble: '#b5813e',
  cafe: '#92400e',
  naranja: '#f97316',
  amarillo: '#fbbf24',
  rosa: '#f472b6',
  plateado: '#d1d5db',
  dorado: '#f59e0b',
  celeste: '#38bdf8',
  beige: '#e5c99d',
  vinotinto: '#7f1d1d',
  turquesa: '#2dd4bf',
};

/**
 * VariantSelector supports two value formats:
 *  - Legacy string array:    values: ['Rojo', 'Azul']
 *  - Rich object array:      values: [{ label, image, stock }]
 *
 * Props:
 *  - variants:       [{ option, values }]
 *  - selected:       { [option]: label }
 *  - onChange:       (option, label) => void
 *  - onVariantData:  (option, { label, image, stock }) => void  — fired when a rich variant is selected
 */
const VariantSelector = ({ variants = [], selected = {}, onChange, onVariantData }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={styles.container}>
      {variants.map(({ option, values }) => {
        const isColorOption = option.toLowerCase().includes('color') || option.toLowerCase().includes('colour');
        const selectedLabel = selected[option];

        // Find selected variant object to show stock inline
        const selectedVariant = values.find((v) => {
          const label = typeof v === 'string' ? v : v.label;
          return label === selectedLabel;
        });
        const selectedStock = selectedVariant && typeof selectedVariant === 'object'
          ? selectedVariant.stock
          : null;

        return (
          <div key={option} className={styles.group}>
            <p className={styles.optionLabel}>
              {option}:{' '}
              {selectedLabel && (
                <span className={styles.selectedValue}>{selectedLabel}</span>
              )}
              {selectedStock != null && (
                <span className={selectedStock === 0 ? styles.stockOut : styles.stockBadge}>
                  {selectedStock === 0 ? ' · Agotado' : ` · ${selectedStock} disponibles`}
                </span>
              )}
            </p>

            <div className={styles.optionValues}>
              {values.map((raw) => {
                const label    = typeof raw === 'string' ? raw : raw.label;
                const imgUrl   = typeof raw === 'object' ? (raw.image ?? null) : null;
                const stock    = typeof raw === 'object' ? (raw.stock ?? null) : null;
                const isSelected = selectedLabel === label;
                const isOutOfStock = stock === 0;
                const colorHex = COLOR_MAP[label.toLowerCase()];

                const handleSelect = () => {
                  if (isOutOfStock) return;
                  onChange(option, label);
                  if (onVariantData && typeof raw === 'object') {
                    onVariantData(option, raw);
                  }
                };

                // Image-based swatch (variant has its own photo)
                if (imgUrl) {
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={handleSelect}
                      disabled={isOutOfStock}
                      title={`${label}${stock != null ? ` (${stock} disponibles)` : ''}`}
                      aria-label={`${option}: ${label}`}
                      aria-pressed={isSelected}
                      className={`${styles.imageSwatch} ${isSelected ? styles.imageSwatchActive : ''} ${isOutOfStock ? styles.outOfStock : ''}`}
                    >
                      <img src={imgUrl} alt={label} className={styles.imageSwatchImg} />
                      {isSelected && <span className={styles.imageSwatchCheck}>✓</span>}
                      {isOutOfStock && <span className={styles.soldOutOverlay}>Agotado</span>}
                    </button>
                  );
                }

                // Color circle swatch
                if (isColorOption && colorHex) {
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`${styles.colorSwatch} ${isSelected ? styles.active : ''} ${isOutOfStock ? styles.outOfStock : ''}`}
                      style={{
                        backgroundColor: colorHex,
                        border: colorHex === '#f9fafb' ? '1px solid #d1d5db' : 'none',
                      }}
                      onClick={handleSelect}
                      disabled={isOutOfStock}
                      title={`${label}${stock != null ? ` (${stock} disponibles)` : ''}`}
                      aria-label={`${option}: ${label}`}
                      aria-pressed={isSelected}
                    >
                      {isOutOfStock && <span className={styles.crossOut} />}
                    </button>
                  );
                }

                // Default pill
                return (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.pill} ${isSelected ? styles.active : ''} ${isOutOfStock ? styles.outOfStock : ''}`}
                    onClick={handleSelect}
                    disabled={isOutOfStock}
                    aria-pressed={isSelected}
                  >
                    {label}
                    {isOutOfStock && <span className={styles.pillOutText}> · Agotado</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;
