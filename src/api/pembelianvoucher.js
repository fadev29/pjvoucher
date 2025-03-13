import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_VOUCHER} from '@env';

const api = API_VOUCHER;
export const belivoucher = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');

    if (!token) {
      throw new Error('Token Tidak Di Temukan');
    }
    const response = await axios.get(`${api}/beliVoucher`, {
      headers: {
        Authorization: token.trim(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('data masuk:  ', response.data);

    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching pembelianVoucher:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const pembelianVoucher = async (jenis, nama, jumlah) => {
  try {
    const token = await AsyncStorage.getItem('@token');

    if (!token) {
      throw new Error('Token Tidak Di Temukan');
    }
    const response = await axios.post(
      `${api}/pembelian`,
      {
        jenis,
        nama,
        jumlah,
      },
      {
        headers: {
          Authorization: token.trim(),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('data masuk:  ', response.data);

    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching pembelianVoucher:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
