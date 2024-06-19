import axios from 'axios';
import sha256 from 'js-sha256';
const codePaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
const keyPaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;

async function getAllCardsMetod (idP) {
    let id = idP;
    const appcode = codePaymentezNuvei;
    const appkey = keyPaymentezNuvei;
  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
  const uniq_token_string = appkey + variableTimestamp;

  const hash = sha256.create();
  hash.update(uniq_token_string);
  hash.hex();

  //const uniq_token_hash = createHash('sha256') + update(uniq_token_string) + digest('hex');
//uniq_token_hash converted to hash
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + hash).toString('base64');
  const urlrefund = `https://ccapi-stg.paymentez.com/v2/card/list?uid=${id}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Auth-Token': auth_token
    }
  };
  await axios.get(urlrefund, config)
/*     .then(response => {
      console.log(response.data);
      console.log(response.dataResponse);
    }) */
    .catch(error => {
      console.error(error);
    });
}

export default getAllCardsMetod;