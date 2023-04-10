import React, { useState } from 'react';
import getAllCards from '../getAllCards';
import TablaCards from './tablaCards';
import { Button } from 'primereact/button';
import Refund from '../refund';
const Tarjetas = ({ userEmail, uId }) => {
  const [cards, setCards] = useState([])
  const [estado, setEstado] = useState(false)

  const lookTarjetasHandler = async () => {
    try {
      console.log('Ver todas las tarjetas guardadas');
      const cardsResponse = await getAllCards(uId);
      console.log(cardsResponse)
      setCards(cardsResponse)
      setEstado(true)
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };
  return (
    <div className='container'>
      <Button onClick={() => lookTarjetasHandler()} className='mb-2' severity='info'>Ver Tarjetas</Button>
      <div>

        {
          estado && <TablaCards cards={cards} uId={uId} email={userEmail} />
        }
        <h1>Compras resientes</h1>
        <Button onClick={() => Refund('idDeTransacion')}>Devolucion</Button>

      </div>
    </div>
  );
}

export default Tarjetas;