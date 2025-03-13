import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_VOUCHER} from '@env';

const api = API_VOUCHER;

console.log('API URL:', api);
export const dasbor = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');

    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    const response = await axios.get(`${api}/dashboard`, {
      headers: {
        Authorization: token.trim(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching dashboard:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
