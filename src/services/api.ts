import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android Emülatör için 10.0.2.2, Gerçek Cihaz / iOS için yerel IP'niz
const BASE_URL = 'http://10.0.2.2:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Her istek öncesi JWT Token'ı otomatik olarak Authorization header'ına ekler
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Projende token hangi key ile tutuluyorsa (token, jwtToken vb.)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token okuma hatası:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;