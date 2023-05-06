import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { deleteCard } from '../deleteCard';
import Referencia from '../reference';
import Debito from '../debitCard';
import { toast } from 'react-toastify';
import TestContext from '@context/TestContext';
import TransactionList from '@containers/TransactionList';

export default function TablaCards({ cards, uId, email }) {
  const orderState = useContext(TestContext);
  const transactionIdState = useContext(TestContext);

  const [transaction, setTransaction] = useState(null);

  const [listCards, setList] = useState([
    {
      nombre: '',
      tipo: '',
      expira: '',
      estado: '',
      token: '',
    },
  ]);

  useEffect(() => {
    let _cards = [];
    cards &&
      cards.map((c) => {
        _cards.push({
          nombre: c.holder_name,
          tipo: c.type,
          expira: c.expiry_year,
          estado: c.status,
          token: c.token,
        });
      });
    setList(_cards);
  }, [cards]);

  const eliminarCard = (token) => {
    deleteCard(token, uId)
      .then((eliminar) => {
        console.log({ eliminar });

        if (eliminar?.data?.message === 'card deleted') {
          toast.success('Su tarjeta se eliminó con éxito.');
        } else {
          toast.error('Tarjeta no encontrada.');
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const InitDebito = async (e) => {
    const _card = {
      number: e.nombre,
      holder_name: e.holder_name,
      expiry_month: e.expiry_month,
      expiry_year: e.expira,
      cvc: '123',
      type: e.tipo,
    };

    const order = orderState.order;

    const initReferencia = await Referencia(uId, email, order);

    const _reference = initReferencia?.data?.reference;

    /**Opcional pago con una referencia */
    //window.location.href = initReferencia.data.checkout_url;
    /************* */

    console.log('debit:', { uId }, { _card }, { _reference }, { order }, e.token);

    /***Debito con tarjeta de credito */
    const _debito = await Debito(uId, email, _card, _reference, order, e.token);

    /*****corregir autentificacion, api devuelte error 403 */
    console.log(_debito);
    if (_debito) {
      transactionIdState.setTransactionID(_debito?.data?.transaction?.id);
      setTransaction(_debito?.data?.transaction);
      toast.info('Muchas gracias, Tu compra ah sido realizada con exito');
    } else {
      toast.error('Rejected: Trate más luego o con otra tarjeta');
    }
  };

  const Acciones = (e) => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <Button severity="success" onClick={() => InitDebito(e)}>
            Pagar
          </Button>
          <Button severity="danger" onClick={() => eliminarCard(e.token)} style={{ marginLeft: '10px' }}>
            Eliminar
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="card" style={{ padding: 10 }}>
      <DataTable value={listCards}>
        <Column field="nombre" header="Nombre"></Column>
        <Column field="tipo" header="tipo Tarjeta"></Column>
        <Column field="expira" header="Expira"></Column>
        <Column field="estado" header="Estado"></Column>
        <Column field="estado" body={Acciones} header="Acciones"></Column>
      </DataTable>
      <TransactionList transaction={transaction} />
    </div>
  );
}
