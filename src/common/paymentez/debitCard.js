import axios from 'axios';
export default async function Debito(uid, email, card, referencia, tokenCard){
    const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
    const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
    console.log('de get cards function')
    console.log(appcode)
    console.log(appkey)
  console.log(card)
  console.log(uid)
  console.log(email)

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');
console.log(auth_token)
console.log("card token = ", tokenCard)
  try {
    const debito = await axios.post(`https://ccapi-stg.paymentez.com/v2/transaction/debit`,{
      "user": {
        "id": "10",
        "email": email,
        "name":"david"
    },
    "order": {
        "amount": 100.00,
        "currency":"USD",
        "description": "pozole",
        "dev_reference": "KJS4520SSKK",
        "vat": 0.00
    },
    "card": {
        "token": tokenCard
    }
     
    },
    {
      headers:{
        "Content-Type": "application/json",
        "auth-token": auth_token
        
      }
    })
    console.log("final fetch",debito)
    return debito
    
  } catch (error) {
    console.log(error)
    console.log(error.message)
  }
} 
