import React from 'react';

const HeroSection = () => (
  <div style={{
    textAlign: 'center',
    padding: '32px 24px 24px',
    maxWidth: '800px',
    margin: '0 auto',
  }}>
    <h1 style={{
      fontSize: 'clamp(1.35rem, 3.5vw, 2rem)',
      fontWeight: '800',
      color: '#4900E4',
      lineHeight: '1.25',
      margin: '0 0 12px',
      letterSpacing: '-0.02em',
    }}>
      El Marketplace que premia tus hábitos sostenibles
    </h1>

    <p style={{
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      color: '#5f6368',
      lineHeight: '1.6',
      margin: '0 auto 28px',
      maxWidth: '620px',
    }}>
      Compra productos 100% nuevos e importados para tu día a día y financia tus compras
      reciclando lo que ya no usas en Quito. Apoyamos la economía circular.
    </p>

    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}>
      <div style={{
        flex: '1 1 220px',
        maxWidth: '300px',
        background: 'linear-gradient(135deg, #f0ebfd 0%, #e8dffc 100%)',
        border: '1px solid #c4b5f4',
        borderRadius: '14px',
        padding: '18px 20px',
        textAlign: 'left',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🛍️</div>
        <p style={{
          fontWeight: '700',
          color: '#4900E4',
          fontSize: '0.875rem',
          margin: '0 0 4px',
        }}>
          Paso 1 — Consumo Inteligente
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: '#5b3daa',
          margin: 0,
          lineHeight: '1.4',
        }}>
          Pide productos nuevos al mejor precio
        </p>
      </div>

      <div style={{
        flex: '1 1 220px',
        maxWidth: '300px',
        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        border: '1px solid #6ee7b7',
        borderRadius: '14px',
        padding: '18px 20px',
        textAlign: 'left',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>♻️</div>
        <p style={{
          fontWeight: '700',
          color: '#065f46',
          fontSize: '0.875rem',
          margin: '0 0 4px',
        }}>
          Paso 2 — Cierre de Ciclo
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: '#047857',
          margin: 0,
          lineHeight: '1.4',
        }}>
          Entrega tus residuos reciclables y acumula saldo para tus compras
        </p>
      </div>
    </div>
  </div>
);

export default HeroSection;
