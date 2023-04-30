import React, { useState, useContext } from 'react';
import getAllCards from '../getAllCards';
import TablaCards from './tablaCards';
//import { getAllCards } from '@entities/cards';
import { Button } from 'primereact/button';
import TestContext from '@context/TestContext';
import Refund from '../refund';
import { toast } from 'react-toastify';

//import getTransactions from '../getTransactions';

const Tarjetas = ({ userEmail, uId }) => {
  const [cards, setCards] = useState([]);
  const [estado, setEstado] = useState(false);
  const transactionIdState = useContext(TestContext);

  const t_id = transactionIdState.transactionID;

  //const transactions = getTransactions();
  //console.log({ transactions });

  const lookTarjetasHandler = async () => {
    try {
      const cardsResponse = await getAllCards(uId);
      setCards(cardsResponse);
      setEstado(true);
    } catch (error) {
      console.log('Error: ', error.message);
    }
  };

  const handleRefund = async () => {
    const result = await Refund(t_id);

    if (result?.success) {
      toast.success(result?.message);
    } else {
      toast.error(result?.message);
    }
  };

  return (
    <div className="container" style={{ padding: 10 }}>
      <Button onClick={() => lookTarjetasHandler()} className="mb-2" severity="info">
        Ver Tarjetas
      </Button>
      {estado && <TablaCards cards={cards} uId={uId} email={userEmail} />}
      <h1 style={{ marginBottom: 10 }}>Compras resientes</h1>
      <Button onClick={handleRefund}>Devolucion</Button>
    </div>
  );
};

export default Tarjetas;
