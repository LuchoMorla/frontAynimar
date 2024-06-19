import React from 'react';

const TransactionResp = ({ transaction }) => {
  return <>{transaction && <div style={{ backgroundColor: '#748f5a', padding: '30px 10px', textAlign: 'center' }}>Muchas gracias, tú compra se ah realizado con exito y de forma segura</div>}</>;
};

export default TransactionResp;
