import React, {useState, useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/navbar';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {dasbor} from '../api/dasbor';

function Home() {
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState('');
  const navigation = useNavigation();
  const [saldoUtama, setSaldoUtama] = useState(0);
  const [saldoBonus, setSaldoBonus] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const nama = await AsyncStorage.getItem('@nama');
        const tipe = await AsyncStorage.getItem('@tipe');
        if (nama && tipe) {
          setNama(nama);
          setTipe(tipe);
        }
        const response = await dasbor();
        if (response) {
          setSaldoUtama(response.saldo_utama || 0);
          setSaldoBonus(response.saldo_bonus || 0);
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleHistoryPress = () => {
    if (tipe === 'reseller') {
      navigation.navigate('History');
    } else {
      navigation.navigate('HistoryPelanggan');
    }
  };

  return (
    <>
      <View>
        <LinearGradient
          colors={['blue', '#FF8B37']}
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
            <Text style={{fontSize: 21, color: '#fff', fontWeight: 'bold'}}>
              Halo, {nama}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#FF8B37',
                fontWeight: '700',
                fontFamily: 'Poppins-Regular',
                textTransform: 'capitalize',
              }}>
              {tipe}
            </Text>
            <Text style={{fontSize: 14, color: '#fff'}}>PJ Voucher</Text>
            <View style={{flexDirection: 'row', gap: 10}}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  left: 150,
                  top: 15,
                  gap: 10,
                }}>
                <View style={{flexDirection: 'row', right: 20}}>
                  <Icon
                    name="wallet"
                    size={25}
                    color="blue"
                    style={{right: 50}}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#fff',
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      right: 40,
                    }}>
                    Rp {saldoUtama}
                  </Text>
                </View>

                <Icon name="gift" size={25} color="red" style={{left: 59}} />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#fff',
                    left: 59,
                  }}>
                  Rp
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#fff',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    left: 55,
                  }}>
                  {saldoBonus}
                </Text>
              </View>
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
                marginRight: 10,
                marginTop: -40,
              }}>
              <Icon name="user" size={30} color="#fff" />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={{flex: 1, marginRight: 500, marginTop: 100}}>
        <View
          style={{
            width: 562,
            height: 562,
            borderRadius: 400,
            backgroundColor: '#FF8B37',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: 485,
              height: 485,
              borderRadius: 300,
              backgroundColor: 'blue',
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
              backgroundColor: '#FF8B37',
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

        <TouchableOpacity onPress={handleHistoryPress} style={{opacity: 1}}>
          <View
            style={{
              width: 321,
              height: 139,
              backgroundColor: '#FF8B37',
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
              backgroundColor: '#FF8B37',
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
