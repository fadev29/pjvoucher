import React, {useState, useCallback} from 'react';
import {Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/navbar';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {dasbor} from '../api/dasbor';

function Home() {
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('');
  const [saldoUtama, setSaldoUtama] = useState(0);
  const [saldoBonus, setSaldoBonus] = useState(0);
  const navigation = useNavigation();

  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        Alert.alert('Sesi Habis', 'Silakan login kembali.');
        await AsyncStorage.clear();
        navigation.replace('Login');
        return;
      }

      const [storedNama, storedTipe] = await Promise.all([
        AsyncStorage.getItem('@nama'),
        AsyncStorage.getItem('@tipe'),
      ]);

      if (storedNama) setNama(storedNama);
      if (storedTipe) setTipe(storedTipe);

      const response = await dasbor(token);
      if (response?.status === 401) {
        Alert.alert('Sesi Habis', 'Silakan login kembali.');
        await AsyncStorage.clear();
        navigation.replace('Login');
        return;
      }

      if (response) {
        setSaldoUtama(response.saldo_utama || 0);
        setSaldoBonus(response.saldo_bonus || 0);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      Alert.alert('Kesalahan', 'Gagal mengambil data. Silakan coba lagi.');
    }
  }, [navigation]);

  useFocusEffect(fetchUserData);

  const handleHistoryPress = () => {
    navigation.navigate(tipe === 'reseller' ? 'History' : 'HistoryPelanggan');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ECE7FC'}}>
      <LinearGradient
        colors={['blue', '#FF8B37']}
        style={{
          padding: 20,
          borderRadius: 20,
          marginTop: -20,
          borderWidth: 2,
          borderColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1, gap: 5}}>
          <Text style={{fontSize: 21, color: '#fff', fontWeight: 'bold'}}>
            Halo, {nama}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#FF8B37',
              fontWeight: '700',
              textTransform: 'capitalize',
            }}>
            {tipe}
          </Text>
          <Text style={{fontSize: 14, color: '#fff'}}>PJ Voucher</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Icon name="wallet" size={25} color="blue" />
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
              Rp {saldoUtama}
            </Text>
            <Icon name="gift" size={25} color="red" />
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
              Rp {saldoBonus}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileUser')}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: '#FF8B37',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="user" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>
      <View style={{padding: 20, marginTop: 40}}>
        <Text style={{fontSize: 19, fontWeight: 'bold', marginBottom: 10}}>
          Pilih Yang Kamu Inginkan
        </Text>
        {[
          {
            title: 'Beli Voucher',
            desc: 'Pembelian Voucher Berlangganan',
            img: require('../components/images/Payment1.png'),
            onPress: () => navigation.navigate('PembelianVoucher'),
          },
          {
            title: 'Histori',
            desc: 'Riwayat Transaksi Voucher',
            img: require('../components/images/Clippathgroup.png'),
            onPress: handleHistoryPress,
          },
          {
            title: 'Printer',
            desc: 'Pengaturan Printer',
            img: require('../components/images/Files1.png'),
            onPress: () => navigation.navigate('PrinterScreen'),
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={{marginBottom: 20, alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FF8B37',
                padding: 20,
                borderRadius: 20,
                width: '100%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}>
              <Image
                source={item.img}
                style={{
                  width: 110,
                  height: 80,
                  marginRight: 20,
                  resizeMode: 'contain',
                }}
              />
              <View>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>
                  {item.title}
                </Text>
                <Text style={{fontSize: 12, color: '#fff'}}>{item.desc}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Navbar />
    </View>
  );
}

export default Home;
