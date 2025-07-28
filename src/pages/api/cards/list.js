// pages/api/cards/list.js
import axios from 'axios';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({ message: 'User ID (uid) is required' });
  }

  try {
    const serverApplicationCode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;
    const serverAppKey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;

    if (!serverApplicationCode || !serverAppKey) {
      console.error("Error: Las variables de entorno de Paymentez no están cargadas.");
      return res.status(500).json({ message: 'Error de configuración del servidor.' });
    }

    // Generar timestamp Unix
    const unixTimestamp = Math.floor(Date.now() / 1000).toString();
    
    // Crear token hash
    const uniqTokenString = serverAppKey + unixTimestamp;
    const uniqTokenHash = crypto
      .createHash('sha256')
      .update(uniqTokenString)
      .digest('hex');
    
    // Crear auth token en formato Base64
    const authTokenString = `${serverApplicationCode};${unixTimestamp};${uniqTokenHash}`;
    const authToken = Buffer.from(authTokenString).toString('base64');

    const url = `https://ccapi-stg.paymentez.com/v2/card/list?uid=${uid}`;

    const paymentezResponse = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Auth-Token': authToken
      }
    });

    res.status(200).json(paymentezResponse.data);

  } catch (error) {
    console.error('❌ Error en API Route al obtener tarjetas:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: 'Error al obtener las tarjetas',
      error: error.response?.data || 'Internal Server Error'
    });
  }
}