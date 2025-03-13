import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Input from '../components/input';
import Button from '../components/button';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {gantipassword} from '../api/gantipassword';

function GantiPassword() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [passwordBaru2, setPasswordBaru2] = useState('');
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const handleGantiPassword = async () => {
    if (!password || !passwordBaru || !passwordBaru2) {
      Alert.alert('Error', 'Semua kolom harus diisi');
      return;
    }

    if (passwordBaru !== passwordBaru2) {
      Alert.alert('Error', 'Password baru tidak cocok');
      return;
    }

    try {
      await gantipassword({
        password,
        password_baru: passwordBaru,
        password_baru2: passwordBaru2,
      });
      Alert.alert('Sukses', 'Password berhasil diubah', [
        {text: 'OK', onPress: () => navigation.navigate('ProfileUser')},
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal mengubah password',
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'blue'}}>
      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#fff',
          }}>
          Ganti Password
        </Text>

        <View style={{gap: 15}}>
          <View>
            <Input
              label="Password Lama"
              placeholder="Masukkan password lama"
              secureTextEntry={secureOld}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecureOld(!secureOld)}
              style={{position: 'absolute', right: 15, top: 45}}>
              <Icon
                name={secureOld ? 'eye-slash' : 'eye'}
                size={20}
                color="#382A6B"
              />
            </TouchableOpacity>
          </View>

          <View>
            <Input
              label="Password Baru"
              placeholder="Masukkan password baru"
              secureTextEntry={secureNew}
              value={passwordBaru}
              onChangeText={setPasswordBaru}
            />
            <TouchableOpacity
              onPress={() => setSecureNew(!secureNew)}
              style={{position: 'absolute', right: 15, top: 45}}>
              <Icon
                name={secureNew ? 'eye-slash' : 'eye'}
                size={20}
                color="#382A6B"
              />
            </TouchableOpacity>
          </View>

          <View>
            <Input
              label="Konfirmasi Password Baru"
              placeholder="Ulangi password baru"
              secureTextEntry={secureConfirm}
              value={passwordBaru2}
              onChangeText={setPasswordBaru2}
            />
            <TouchableOpacity
              onPress={() => setSecureConfirm(!secureConfirm)}
              style={{position: 'absolute', right: 15, top: 45}}>
              <Icon
                name={secureConfirm ? 'eye-slash' : 'eye'}
                size={20}
                color="#382A6B"
              />
            </TouchableOpacity>
          </View>

          <Button onPress={handleGantiPassword}>Ganti Password</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default GantiPassword;
