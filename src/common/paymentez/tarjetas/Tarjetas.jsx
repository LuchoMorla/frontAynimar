import React, { useState } from 'react';
import getAllCards from '../getAllCards';
import TablaCards from './tablaCards';
import { Button } from 'primereact/button';

const Tarjetas = ({ userEmail, uId }) => {
  const [cards, setCards] = useState([]);
  const [estado, setEstado] = useState(false);

  const lookTarjetasHandler = async () => {
    try {
      const cardsResponse = await getAllCards(uId);
      setCards(cardsResponse);
      setEstado(true);
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  return (
    <div className="container" style={{ padding: 10 }}>
      <Button onClick={() => lookTarjetasHandler()} className="mb-2" severity="info">
        Ver Tarjetas
      </Button>
      {estado && <TablaCards cards={cards} uId={uId} email={userEmail} />}
    </div>
  );
};

export default Tarjetas;
