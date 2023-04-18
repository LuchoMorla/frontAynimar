import axios from 'axios';
const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;

async function getAllCards(id) {
  console.log('de get Allcards function, id: ', id)

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
 /*  const variableTimestamp = String(Math.floor(Date.now()) + 17); */
  console.log('variable timestam esta en: ',variableTimestamp);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');
  console.log(auth_token)
  try {
    const options = {
        headers:{
            'Content-Type':'application/json',
            'Auth-Token': auth_token
          }
    };

    const card = await axios.get(`https://ccapi-stg.paymentez.com/v2/card/list?uid=${id}`, options);
    console.log("final fetch",card);
    return card.data.cards;
  } catch (error) {
    console.log(error.message);
  }
};

export { getAllCards };