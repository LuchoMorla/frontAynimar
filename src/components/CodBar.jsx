import React from 'react';

const CodBar = () => (
  <div style={{
    background: '#065f46',
    color: '#ffffff',
    textAlign: 'center',
    padding: '10px 16px',
    fontSize: '0.88rem',
    fontWeight: '600',
    letterSpacing: '0.01em',
    lineHeight: '1.4',
  }}>
    💵{' '}
    <strong style={{ fontSize: '0.95rem' }}>Paga al recibir en tu puerta</strong>
    {' · '}Sin riesgo de fraude · Efectivo o transferencia al momento de la entrega
  </div>
);

export default CodBar;
