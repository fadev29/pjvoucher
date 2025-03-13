import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_VOUCHER} from '@env';

const api = API_VOUCHER;

export const gantipassword = async ({
  password,
  password_baru,
  password_baru2,
}) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    console.log(token);

    if (!token) {
      throw new Error('Token Tidak Ditemukan');
    }

    const response = await axios.post(
      `${api}/gantipassword`,
      {password, password_baru, password_baru2},
      {
        headers: {
          Authorization: `${token.trim()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ Password berhasil diubah:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error mengganti password:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
