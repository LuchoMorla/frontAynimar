import axios from 'axios';

export default async function Debito(uid, email, card, referencia, order, tokenCard) {

  const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
  const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 13);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');

  try {
    const debito = await axios.post(`https://ccapi-stg.paymentez.com/v2/transaction/debit`, {
      "user": {
        "id": uid.toString(),
        "email": email,
        "name": "david"
      },
      "order": {
        // "amount": order.total,
        "amount": 112.00,
        "description": "pozole",
        "dev_reference": "referencia",
        "vat": 12.00,
        "tax_percentage": 12.00
      },
      "card": {
        "token": tokenCard
      }
    },
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": auth_token

        }
      });
    return debito;

  } catch (error) {
    console.log(error);
  }
} 
