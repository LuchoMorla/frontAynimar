import axios from 'axios';
export default async function DeleteCard(t, uid){
    const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
    const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
    console.log('de get cards function')
    console.log(appcode)
    console.log(appkey)
  console.log(t)
  console.log(uid)

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');
console.log(auth_token)
  try {
    const cardDelete = await axios.post(`https://ccapi-stg.paymentez.com/v2/card/delete`,{
    "card": {
        "token":"6148239935162257742"
    },
    "user": {
        "id":uid.toString()
    }
    },{
      headers:{
        'Content-Type':'application/json',
        'Auth-Token': auth_token
      }
    })
    console.log("final fetch",cardDelete)
    return cardDelete
    
  } catch (error) {
    console.log(error.message)
  }
} 
