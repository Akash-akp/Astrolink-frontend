import axios from 'axios';

const proxyService = axios.create({
  baseURL: 'http://localhost:8090/api/v1',
});

export default proxyService;