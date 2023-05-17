import axios from 'axios';

export default async function getTransactions() {

  const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
  const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 13);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');

  try {
    axios.get(`https://ccapi.paymentez.com/v2/transaction/verify`, {},
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": auth_token
        }
      }).catch(err => {
        console.log(err);
      });

  } catch (error) {
    console.log(error);
  }
} 
