import { useState, useEffect } from 'react';
import axios from 'axios';

const useOrders = (endPoint, body) => {
  const [data, setData] = useState([]);

  async function fetchData() {
    const config = {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      };
    const response = await axios.post(endPoint, body, config)
    .then(function (response) {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
            if(response?.error.status == 401) {
                console.log('funciono doble THEN Luis, campuramos el error 401 mira-> ' + error.status);
              }
            }
        )
    .catch(function (error) {
    if (error.response) {
      // La respuesta fue hecha y el servidor respondió con un código de estado
      // que esta fuera del rango de 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      if(response?.error.status == 401) {
        console.log('funciono doble CATCH Luis, campuramos el error 401 mira-> ' + error.status + ` y  tambien el mensaje es ${error.message}`);
      }
      console.log(error.response.headers);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
      // http.ClientRequest en node.js
      console.log(error.request);
    } else {
      // Algo paso al preparar la petición que lanzo un Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
    setData(response.data);
  }

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
      console.log(`Luis Mira este errror!!! lo capturamos: ${error.status}`);
      if(error.status == 401) {
        console.log('funciono doble Luis, campuramos el error 401 mira-> ' + error.status);
      }
    }
  }, [endPoint]);

  return data;
};

const createOrderFetch = () => {
    const [data, setData] = useState([]);

    async function fetchData() {
/*       const config = {
          headers: {
            accept: '*//*',
            'Content-Type': 'application/json',
          },
        }; */
      const response = await axios.post(endPoint/* , config */)
      .catch(function (error) {
        if (error.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado
          // que esta fuera del rango de 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          if(response?.error.status == 401) {
            console.log('funciono doble CATCH Luis, campuramos el error 401 mira-> ' + error.status + ` y  tambien el mensaje es ${error.message}`);
          }
          console.log(error.response.headers);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
          // http.ClientRequest en node.js
          console.log(error.request);
        } else {
          // Algo paso al preparar la petición que lanzo un Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
      setData(response.data);
    }
  
    useEffect(() => {
      try {
        fetchData();
      } catch (error) {
        console.log(error);
        console.log(`Luis Mira este errror!!! lo capturamos: ${error.status}`);
        if(error.status == 401) {
          console.log('funciono doble Luis, campuramos el error 401 mira-> ' + error.status);
        }
      }
    }, [endPoint]);
  
    return data;
};

export default { useOrders, createOrderFetch };