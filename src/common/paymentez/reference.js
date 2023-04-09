import axios from 'axios';
export default async function Referencia(uid, email) {
    const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
    const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
    console.log('de get cards function')
    console.log(appcode)
    console.log(appkey)
    console.log(uid)
    console.log(email)

    const variableTimestamp = String(Math.floor(Date.now() / 1000) + 17);
    const uniq_token_string = appkey + variableTimestamp;
    const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
    const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');
    console.log(auth_token)
    try {
        const referencia = await axios.post(`https://ccapi-stg.paymentez.com/v2/transaction/init_reference`, {
            "locale": "es",
            "order": {
                "amount": 100.00,
                "description": "producto",
                "vat": 0,
                "dev_reference": "David Castro",
                "installments_type": 0
            },
            "user": {
                "id": uid,
                "email": email
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Auth-Token': auth_token
            }
        })
        console.log("final fetch", referencia)
        return referencia

    } catch (error) {
        console.log(error.message)
    }
} 
