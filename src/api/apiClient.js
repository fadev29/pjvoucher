import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_VOUCHER} from '@env';
import {Alert} from 'react-native';
import {navigate} from '../navigation/navigationService';

const apiClient = axios.create({
  baseURL: API_VOUCHER,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      console.log('🔑 Token expired! Logout otomatis...');

      await AsyncStorage.removeItem('@token');
      await AsyncStorage.removeItem('@nama');
      await AsyncStorage.removeItem('@tipe');

      Alert.alert('Session Expired', 'Silakan login kembali.', [
        {text: 'OK', onPress: () => navigate('Login')},
      ]);

      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
