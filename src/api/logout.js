import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const logout = async () => {
  try {
    const response = await apiClient.post('/logout');

    console.log('Logout response:', response.data);

    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@nama');
    await AsyncStorage.removeItem('@tipe');

    delete apiClient.defaults.headers.common['Authorization'];

    return response.data;
  } catch (error) {
    console.error(
      '❌ Error saat logout:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
