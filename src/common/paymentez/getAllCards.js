// Este archivo ahora solo se encarga de llamar a nuestra propia API
import axios from 'axios';

async function getAllCards(uid) {
  try {
    // Hacemos la petición a nuestra propia API Route, pasándole el uid
    const response = await axios.get(`/api/cards/list?uid=${uid}`);
    
    // Nuestra API nos devuelve el objeto completo, que incluye la propiedad 'cards'
    return response.data.cards; 
    
  } catch (error) {
    // El error ahora vendrá de nuestro propio backend, lo que es más fácil de depurar
    console.error('❌ Error al llamar a nuestra API interna:', error.response?.data || error.message);
    // Podrías lanzar el error para que el componente lo capture o devolver null/vacío
    throw new Error(error.response?.data.message || 'No se pudieron obtener las tarjetas');
  }
}

export default getAllCards;

// import axios from 'axios';

// export default async function getAllCards(id) {

//   const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
//   const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;

//   const variableTimestamp = String(Math.floor(Date.now() / 1000) + 12);
//   const uniq_token_string = appkey + variableTimestamp;
//   const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
//   const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');

//   try {
//     const card = await axios.get(`https://ccapi-stg.paymentez.com/v2/card/list?uid=${id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Auth-Token': auth_token
//       }
//     });
//     return card.data.cards;

//   } catch (error) {
//     console.log(error.message);
//   }
// } 
