import React from 'react';

const TransactionList = ({ transaction }) => {
  return (
    <>
      {transaction && (
        <div key={transaction.id} style={{ backgroundColor: '#748f5a', padding: '10px', textAlign: 'left' }}>
          <div style={{ width: 'fit-content', margin: 'auto' }}>
            <p>Transaction ID: {transaction.id}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Payment Date: {transaction.payment_date}</p>
            <p>Payment Status: {transaction.status}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionList;
