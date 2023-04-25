import axios from 'axios';

export const deleteCard = (token, uid) => {

  return new Promise((resolve, reject) => {
    const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
    const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;

    const variableTimestamp = String(Math.floor(Date.now() / 1000) + 12);
    const uniq_token_string = appkey + variableTimestamp;
    const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
    const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');

    try {
      const cardOption = {
        "card": {
          "token": token
        },
        "user": {
          "id": uid.toString()
        }
      };

      axios.post(
        `https://ccapi-stg.paymentez.com/v2/card/delete`,
        cardOption,
        {
          headers: {
            'Content-Type': 'application/json',
            'Auth-Token': auth_token
          }
        }).then(response => {
          resolve(response);
        }).catch(err => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });


};
