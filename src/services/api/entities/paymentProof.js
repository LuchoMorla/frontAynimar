import axios from 'axios';
import endPoints from '@services/api';

const authHeaders = (token) => ({
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
});

// Info de pago DeUna para una orden (link/QR, monto autorizado, referencia).
// 100% lectura — nunca modifica la orden.
const getDeunaPaymentInfo = async (orderId, token) => {
    const response = await axios.get(endPoints.orders.deunaPaymentInfo(orderId), authHeaders(token));
    return response.data;
};

// Registra el comprobante YA subido a Firebase Storage (fileUrl = URL real
// del archivo). El backend valida que la URL sea una imagen real alojada en
// el storage de Aynimar antes de aceptarla — ver Services/paymentProofService.js.
const submitPaymentProof = async (orderId, fileUrl, token) => {
    const response = await axios.post(
        endPoints.orders.uploadPaymentProof(orderId),
        { fileUrl },
        authHeaders(token)
    );
    return response.data;
};

const getPaymentProofs = async (orderId, token) => {
    const response = await axios.get(endPoints.orders.getPaymentProofs(orderId), authHeaders(token));
    return response.data;
};

export { getDeunaPaymentInfo, submitPaymentProof, getPaymentProofs };
