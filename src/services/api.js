import axios from 'axios';

const api = axios.create({
  baseURL: 'https://trocaai-api.herokuapp.com/',
});

export default api;
