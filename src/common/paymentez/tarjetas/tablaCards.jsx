import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookie from 'js-cookie';
import axios from 'axios';
import { deleteCard } from '../deleteCard';
import Referencia from '../reference';
import Debito from '../debitCard';
import { toast } from 'react-toastify';
import TestContext from '@context/TestContext';
import AppContext from '@context/AppContext';
import endPoints from '@services/api';
import { sendTransaction } from '@services/api/entities/transaction';
import { updateOrder } from '@services/api/entities/updateOrder';
import TransactionResp from '@containers/TransactionResp';

export default function TablaCards({ cards, uId, email }) {
  const router = useRouter();
  const { order: orderFromContext, setOrder, setTransactionID } = useContext(TestContext);
  const { clearCart } = useContext(AppContext);

  const [transactionSuccess, setTransactionState] = useState(false);
  const [onDebit, setOnDebit] = useState(false);
  const [listCards, setList] = useState([]);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  // useEffect para cargar la orden - CORREGIDO
  useEffect(() => {
    const loadActiveOrder = async () => {
      if (orderFromContext && orderFromContext.items && orderFromContext.items.length > 0) {
        return; // Solo retornar si hay una orden válida con items
      }

      if (isLoadingOrder) return; // Evitar múltiples cargas simultáneas

      setIsLoadingOrder(true);
      const userHasToken = !!Cookie.get('token');
      const activeOrderId = window.localStorage.getItem('oi');
      let orderData = null;

      try {
        if (userHasToken) {
          const { data } = await axios.get(endPoints.orders.getOrderByState, { 
            params: { state: 'carrito' } 
          });
          orderData = data;
        } else if (activeOrderId) {
          const { data } = await axios.get(endPoints.orders.getGuestOrder(activeOrderId));
          orderData = data;
        }
        
        if (orderData && orderData.items && orderData.items.length > 0) {
          setOrder(orderData);
        } else {
          // Si no hay orden válida, limpiar el contexto
          setOrder(null);
        }
      } catch (error) {
        console.error('Error al cargar la orden en TablaCards:', error);
        setOrder(null);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    loadActiveOrder();
  }, [orderFromContext, setOrder, isLoadingOrder]); // Agregadas todas las dependencias

  // useEffect para mapear las tarjetas que llegan como props.
  useEffect(() => {
    let _cards = [];
    cards?.map((c) => {
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
        toast.error('Error al eliminar la tarjeta.');
      });
  };

  const InitDebito = async (e) => {
    setOnDebit(true);
    const order = orderFromContext;

    if (!order || !order.items || order.items.length === 0) {
      toast.warning('No hay una orden activa con productos para pagar.');
      setOnDebit(false);
      return;
    }

    try {
      const initReferencia = await Referencia(uId, email, order);
      const _reference = initReferencia?.data?.reference;
      const _debito = await Debito(uId, email, {}, _reference, order, e.token);

      if (_debito?.data?.transaction) {
        const transactionData = _debito.data.transaction;
        setTransactionID(transactionData.id);

        const data = {
          customerId: order.customerId,
          orderId: order.id,
          transactionId: transactionData.id,
          amount: transactionData.amount,
          paymentDate: transactionData.payment_date,
          paymentStatus: transactionData.status,
          authorizationCode: transactionData.authorization_code,
        };
        const res = await sendTransaction(data);

        if (res?.data?.paymentStatus === 'success') {
          // --- BLOQUE DE ÉXITO - CORREGIDO ---
          try {
            toast.info('Pago exitoso. Finalizando tu orden...');
            
            await updateOrder(order.id, { state: 'pagada' });
            
            // Limpiar en el orden correcto y asegurar que se complete
            window.localStorage.removeItem('oi');
            
            // Limpiar el contexto ANTES de clearCart
            setOrder(null);
            
            // Llamar clearCart
            await clearCart();
            
            setTransactionState(true);
            toast.success('¡Muchas gracias! Tu compra se ha completado.');
            
            // setTimeout(() => {
            //   router.push('/mi_cuenta/orders');
            // }, 2000);
            router.push('/mi_cuenta/orders');

          } catch (updateError) {
            console.error("Pago exitoso, pero falló la actualización de la orden:", updateError);
            toast.error("Tu pago fue procesado, pero hubo un problema al finalizar tu orden. Contáctanos.");
            setTransactionState(true);
          }
        } else {
          // --- BLOQUE DE FRACASO (PAGO PROCESADO PERO NO EXITOSO) ---
          toast.error('El estado del pago no fue exitoso. Por favor, contacta a soporte.');
          setOnDebit(false);
        }
      } else {
        // --- BLOQUE DE FRACASO (PAGO RECHAZADO) ---
        toast.error('Pago rechazado. Intente más tarde o con otra tarjeta.');
        setOnDebit(false);
      }
    } catch (paymentError) {
      console.error("Error durante el proceso de pago:", paymentError);
      toast.error("Ocurrió un error inesperado durante el pago.");
      setOnDebit(false);
    }
  };

  const Acciones = (e) => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <Button 
            disabled={onDebit || isLoadingOrder || !orderFromContext || !orderFromContext.items || orderFromContext.items.length === 0} 
            severity="success" 
            onClick={() => InitDebito(e)}
          >
            {isLoadingOrder ? 'Cargando...' : 'Pagar'}
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
        <Column field="tipo" header="Tipo Tarjeta"></Column>
        <Column field="expira" header="Expira"></Column>
        <Column field="estado" header="Estado"></Column>
        <Column field="estado" body={Acciones} header="Acciones"></Column>
      </DataTable>
      <TransactionResp transaction={transactionSuccess} />
    </div>
  );
}