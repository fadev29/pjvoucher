import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_VOUCHER} from '@env';

const api = API_VOUCHER;

export const logout = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    if (!token) {
      throw new Error('Token Tidak Ditemukan');
    }

    const response = await axios.post(`${api}/logout`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Logout response:', response.data);

    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@nama');
    await AsyncStorage.removeItem('@tipe');

    return response.data;
  } catch (error) {
    console.error(
      '❌ Error saat logout:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
