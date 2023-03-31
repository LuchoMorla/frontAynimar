const https = require('https');
const codePaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE;
const keyPaymentezNuvei = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY;

if (id) {
  const id = id;
  const appcode = codePaymentezNuvei;
  const appkey = keyPaymentezNuvei;
  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');
  const urlrefund = 'https://ccapi-stg.paymentez.com/v2/card/list?uid=' + id;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Auth-Token': auth_token
    }
  };
  const req = https.request(urlrefund, options, res => {
    let response = '';
    res.on('data', chunk => {
      response += chunk;
    });
    res.on('end', () => {
      console.log(response);
    });
  });
  req.on('error', error => {
    console.error(error);
  });
  req.end();
}