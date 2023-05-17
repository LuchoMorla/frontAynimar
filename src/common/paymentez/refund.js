import axios from 'axios';

export default async function Refund(transactionId) {
  const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
  const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');
 // pruebas https://ccapi-stg.paymentez.com/v2/transaction/refund/
  try {
    const refund = await axios.post(`https://ccapi.paymentez.com/v2/transaction/refund/`, {
      "transaction": {
        "id": transactionId
      }

    }, {
      headers: {
        'Content-Type': 'application/json',
        'Auth-Token': auth_token
      }
    });
    if (refund?.data.status === "success") {
      return { success: true, message: "Refund Successfully!" };
    } else {
      return { success: false, message: refund?.data.detail };
    }

  } catch (error) {
    return { success: false, message: "Validation Error." };
  }
} 
