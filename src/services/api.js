import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Use the axios instance for the GET request
api.get('/someendpoint')
  .then(response => {
    // Manejo de la respuesta exitosa
    console.log('Response:', response.data);
  })
  .catch(error => {
    if (error.response) {
      // The server responded with a status code outside the range 2xx
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error in setting up the request or processing it
      console.error('Error al procesar la solicitud:', error.message);
    }
    console.error('Configuración de la solicitud:', error.config);
  });

export default api;
