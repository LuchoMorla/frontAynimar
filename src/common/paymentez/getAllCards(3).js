const axios = require('axios');
const codePaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
const keyPaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;

 var urlrefund = await `https://ccapi.paymentez.com/v2/card/list?uid=${id}`;
