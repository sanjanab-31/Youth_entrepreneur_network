import axios from 'axios';
import { auth } from '../src/firebase/config';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(false);
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn('Token fetch failed, sending request without token', error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
