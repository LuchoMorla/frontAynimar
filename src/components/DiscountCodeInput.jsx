import React, { useState } from 'react';

const DiscountCodeInput = () => {
  const [discountCode, setDiscountCode] = useState('');

  const handleInputChange = (event) => {
    setDiscountCode(event.target.value);
  };

  const handleApplyDiscount = () => {
    // Lógica para aplicar el descuento con el código ingresado
    // Puedes llamar a una función externa o emitir un evento con el código para que otro componente lo procese
  };

  return (
    <div>
      <input type="text" value={discountCode} onChange={handleInputChange} />
      <button onClick={handleApplyDiscount}>Aplicar descuento</button>
    </div>
  );
};

export default DiscountCodeInput;
