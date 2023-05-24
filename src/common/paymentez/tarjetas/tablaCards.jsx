import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { deleteCard } from '../deleteCard';
import Referencia from '../reference';
import Debito from '../debitCard';
import { toast } from 'react-toastify';
import TestContext from '@context/TestContext';
import { sendTransaction } from '@services/api/entities/transaction';
import { updateOrder } from '@services/api/entities/updateOrder';
import TransactionResp from '@containers/TransactionResp';

export default function TablaCards({ cards, uId, email }) {
  const orderState = useContext(TestContext);
  const transactionIdState = useContext(TestContext);

  const [transactionSuccess, setTransactionState] = useState(false);
  const [onDebit, setOnDebit] = useState(false);

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
    console.log('1', onDebit);
    setOnDebit(true);
    console.log('1', onDebit);
    const _card = {
      number: e.nombre,
      holder_name: e.holder_name,
      expiry_month: e.expiry_month,
      expiry_year: e.expira,
      cvc: '123',
      type: e.tipo,
    };

    const order = orderState.order;

    if (order === null) {
      toast.warning('No hay lista de pedidos');
      console.log('1,5', onDebit);
      setOnDebit(false);
      console.log('1,5', onDebit);
      return;
    }

    const initReferencia = await Referencia(uId, email, order);

    const _reference = initReferencia?.data?.reference;

    /**Opcional pago con una referencia */
    //window.location.href = initReferencia.data.checkout_url;
    /************* */

    /***Debito con tarjeta de credito */
    const _debito = await Debito(uId, email, _card, _reference, order, e.token);

    const transactionData = _debito?.data?.transaction;
    const { id, amount, payment_date, status, authorization_code } = transactionData;

    if (_debito) {
      transactionIdState.setTransactionID(_debito?.data?.transaction?.id);
      const data = {
        customerId: order?.customerId,
        orderId: order?.id,
        transactionId: id,
        amount: amount,
        paymentDate: payment_date,
        paymentStatus: status,
        authorizationCode: authorization_code,
      };
      const res = await sendTransaction(data);
      if (res?.data?.paymentStatus === 'success') {
        //update order  => pagada
        updateOrder(order?.id, { state: 'pagada' });
      }
      setTransactionState(true);
      toast.info('Muchas gracias, tú pago se ah realizado con exito y de forma segura');
      console.log('2', onDebit);
      setOnDebit(false);
      console.log('2', onDebit);
    } else {
      toast.error('Rejected: Trate más luego o con otra tarjeta');
      console.log('3', onDebit);
      setOnDebit(false);
      console.log('3', onDebit);
    }
  };

  const Acciones = (e) => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <Button disable={onDebit} severity="success" onClick={() => InitDebito(e)}>
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
      <TransactionResp transaction={transactionSuccess} />
    </div>
  );
}
