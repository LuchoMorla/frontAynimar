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
};

const VariantSelector = ({ variants = [], selected = {}, onChange }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className={styles.container}>
      {variants.map(({ option, values }) => {
        const isColorOption = option.toLowerCase().includes('color');
        return (
          <div key={option} className={styles.group}>
            <p className={styles.optionLabel}>
              {option}:{' '}
              {selected[option] && (
                <span className={styles.selectedValue}>{selected[option]}</span>
              )}
            </p>
            <div className={styles.optionValues}>
              {values.map((value) => {
                const colorHex = COLOR_MAP[value.toLowerCase()];
                const isSelected = selected[option] === value;

                if (isColorOption && colorHex) {
                  return (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.colorSwatch} ${isSelected ? styles.active : ''}`}
                      style={{
                        backgroundColor: colorHex,
                        border: colorHex === '#f9fafb' ? '1px solid #d1d5db' : 'none',
                      }}
                      onClick={() => onChange(option, value)}
                      title={value}
                      aria-label={`${option}: ${value}`}
                      aria-pressed={isSelected}
                    />
                  );
                }

                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.pill} ${isSelected ? styles.active : ''}`}
                    onClick={() => onChange(option, value)}
                    aria-pressed={isSelected}
                  >
                    {value}
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
