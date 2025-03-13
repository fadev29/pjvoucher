import React, {useState, useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/navbar';
import {useNavigation} from '@react-navigation/native';

function Home() {
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const nama = await AsyncStorage.getItem('@nama');
        const tipe = await AsyncStorage.getItem('@tipe');
        if (nama && tipe) {
          setNama(nama);
          setTipe(tipe);
        }
      } catch (error) {
        console.log('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <View>
        <LinearGradient
          colors={['#D7CDFA', '#7B5FF1']}
          style={{
            width: '100%',
            height: '50%',
            padding: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
            <Text style={{fontSize: 21, color: '#400040', fontWeight: 'bold'}}>
              HI, {nama}
            </Text>
            <Text style={{fontSize: 16, color: '#400040', fontWeight: '700'}}>
              {tipe}
            </Text>
            <Text style={{fontSize: 14, color: '#400040'}}>PJ Voucher</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ProfileUser')}>
            <Image
              source={require('../components/images/pp.png')}
              style={{width: 60, height: 50}}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={{flex: 1, marginRight: 500, marginTop: 100}}>
        <View
          style={{
            width: 562,
            height: 562,
            borderRadius: 400,
            backgroundColor: '#382A6B',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: 485,
              height: 485,
              borderRadius: 300,
              backgroundColor: '#7D5EEE',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: 420,
                height: 420,
                borderRadius: 200,
                backgroundColor: '#ECE7FC',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}></View>
          </View>
        </View>
      </View>
      <View style={{flex: 1, marginTop: -550, gap: 10, right: 18}}>
        <Text
          style={{
            textAlign: 'left',
            fontSize: 19.47,
            left: 50,
            fontWeight: 'bold',
            bottom: 10,
          }}>
          Pilih Yang Kamu Inginkan
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('PembelianVoucher')}
          style={{opacity: 1}}>
          <View
            style={{
              width: 321,
              height: 139,
              backgroundColor: '#7D5EEE',
              marginLeft: 50,
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <Image
              source={require('../components/images/Payment1.png')}
              style={{width: 92, height: 66.88, marginRight: 15}}
            />
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
                Beli Voucher
              </Text>
              <Text style={{fontSize: 12, color: '#fff'}}>
                Pembelian Voucher Berlangganan
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
          style={{opacity: 1}}>
          <View
            style={{
              width: 321,
              height: 139,
              backgroundColor: '#7D5EEE',
              marginLeft: 50,
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <Image
              source={require('../components/images/Clippathgroup.png')}
              style={{width: 92, height: 66.88, marginRight: 15}}
            />
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
                Histori
              </Text>
              <Text style={{fontSize: 12, color: '#fff'}}>
                Riwayat Transaksi Voucher
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('PrinterScreen')}
          style={{opacity: 1}}>
          <View
            style={{
              width: 321,
              height: 139,
              backgroundColor: '#7D5EEE',
              marginLeft: 50,
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <Image
              source={require('../components/images/Files1.png')}
              style={{width: 92, height: 66.88, marginRight: 15}}
            />
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
                Printer
              </Text>
              <Text style={{fontSize: 12, color: '#fff'}}>
                Pengaturan Printer{' '}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        <Navbar />
      </View>
    </>
  );
}

export default Home;
