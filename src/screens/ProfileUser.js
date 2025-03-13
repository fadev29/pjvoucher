import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Button from '../components/button';
import {useNavigation} from '@react-navigation/native';
import {profileuser} from '../api/profileuser';
import {logout} from '../api/logout';

function ProfileUser() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await AsyncStorage.getItem('@token');
      setToken(storedToken);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileuser();
        setProfile(data);
      } catch (error) {
        console.error('❌ Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChangePassword = () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin mengubah password?', [
      {text: 'Batal', style: 'cancel'},
      {text: 'Ya', onPress: () => navigation.navigate('GantiPassword')},
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin logout?', [
      {text: 'Batal', style: 'cancel'},
      {
        text: 'Ya',
        onPress: async () => {
          try {
            await logout();
            await AsyncStorage.removeItem('token');
            setToken(null);
            navigation.replace('Login');
          } catch (error) {
            Alert.alert('Error', 'Gagal logout, coba lagi.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#7B5FF1" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
      <LinearGradient
        colors={['#D7CDFA', '#7B5FF1']}
        style={{
          width: '100%',
          height: '8%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={30} color="#382A6B" />
        </TouchableOpacity>
        <Text style={{color: '#382A6B', fontSize: 20, marginLeft: 20}}>
          Profile User
        </Text>
      </LinearGradient>
      <View style={{alignItems: 'center', marginTop: 30}}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#D7CDFA',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="shop" size={40} color="#382A6B" />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#382A6B',
            marginTop: 15,
          }}>
          {profile?.type || 'Toko'}
        </Text>
      </View>
      <View style={{marginTop: 30, paddingHorizontal: 20}}>
        <InfoRow icon="user" text={profile?.nama || 'Nama tidak tersedia'} />
        <InfoRow
          icon="location-dot"
          text={profile?.alamat || 'Alamat tidak tersedia'}
        />
        <InfoRow icon="phone" text={profile?.hp || 'Nomor tidak tersedia'} />
      </View>
      <View style={{margin: 20, gap: 10}}>
        {token ? (
          <>
            <Button onPress={handleChangePassword}>Ganti Password</Button>
            <Button onPress={handleLogout}>Logout</Button>
          </>
        ) : (
          <Button onPress={() => navigation.replace('Login')}>Login</Button>
        )}
      </View>
    </View>
  );
}

const InfoRow = ({icon, text}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
      }}>
      <Icon name={icon} size={30} color="#382A6B" />
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#382A6B',
          marginLeft: 15,
        }}>
        {text}
      </Text>
    </View>
  );
};

export default ProfileUser;
