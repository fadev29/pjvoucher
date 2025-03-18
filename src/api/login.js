import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const login = async (username, tipe, password) => {
  try {
    console.log('Login request:', {username, tipe, password});

    const response = await apiClient.post('/login', {
      username,
      tipe,
      password,
    });

    console.log('Login response:', response.data);

    const {token, nama: user, tipe: userTipe} = response.data;
    await saveToken(token, user, userTipe);

    return {status: true, response: response.data};
  } catch (error) {
    if (error.response) {
      console.log('Login error response:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log('Login error request:', error.request);
      return {message: 'Network error. Please try again later.'};
    } else {
      console.log('Login error message:', error.message);
      return {message: error.message};
    }
  }
};

const saveToken = async (token, nama, tipe) => {
  try {
    await AsyncStorage.setItem('@token', token);
    console.log('Token saved:', token);
    await AsyncStorage.setItem('@nama', nama);
    await AsyncStorage.setItem('@tipe', tipe);

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.log('Error saving data:', e);
  }
};
