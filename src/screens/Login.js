import React, {Component} from 'react';
import {Image, View, Text, Alert, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Input from '../components/input';
import Button from '../components/button';
import {login} from '../api/login';
import Icon from 'react-native-vector-icons/FontAwesome6';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      tipe: 'pelanggan',
      secureTextEntry: true,
      loading: false,
      errorMessage: '',
    };
  }

  handleLogin = async () => {
    const {username, password, tipe} = this.state;

    if (!username || !password) {
      this.setState({errorMessage: 'Username dan Password wajib diisi'});
      Alert.alert('Login Gagal', 'Username dan Password wajib diisi');
      return;
    }

    this.setState({loading: true, errorMessage: ''});

    try {
      const response = await login(username, tipe, password);
      if (response.status) {
        Alert.alert('Login Berhasil', 'Anda akan dialihkan ke halaman utama', [
          {
            text: 'OK',
            onPress: () => this.props.navigation.replace('Home'),
          },
        ]);
      } else {
        this.setState({
          errorMessage: response.message || 'Login gagal. Silakan coba lagi.',
        });
        Alert.alert(
          'Login Gagal',
          response.message || 'Login gagal. Silakan coba lagi.',
        );
      }
    } catch (error) {
      this.setState({errorMessage: 'Terjadi kesalahan, coba lagi nanti.'});
      Alert.alert('Login Gagal', 'Terjadi kesalahan, coba lagi nanti.');
    }

    this.setState({loading: false});
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({secureTextEntry: !prevState.secureTextEntry}));
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', backgroundColor: '#F8F8F8'}}>
        <View
          style={{
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: '#382A6B',
            position: 'absolute',
            top: -30,
            alignSelf: 'center',
          }}
        />
        <Image
          source={require('../components/images/Login1.png')}
          style={{width: 250, height: 200, marginTop: 80}}
        />
        <View style={{flex: 1, width: '80%', marginTop: 20}}>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={this.state.username}
            onChangeText={text => this.setState({username: text})}
          />
          <View>
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={this.state.secureTextEntry}
              value={this.state.password}
              onChangeText={text => this.setState({password: text})}
            />
            <TouchableOpacity
              onPress={this.togglePasswordVisibility}
              style={{position: 'absolute', right: 15, top: 45}}>
              <Icon
                name={this.state.secureTextEntry ? 'eye-slash' : 'eye'}
                size={20}
                color="#382A6B"
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            Tipe
          </Text>
          <Picker
            selectedValue={this.state.tipe}
            onValueChange={itemValue => this.setState({tipe: itemValue})}
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#D7CDFA',
              borderRadius: 10,
              color: '#382A6B',
            }}>
            <Picker.Item label="Pelanggan" value="pelanggan" />
            <Picker.Item label="Reseller" value="reseller" />
          </Picker>
          {this.state.errorMessage ? (
            <Text style={{color: 'red', marginTop: 5}}>
              {this.state.errorMessage}
            </Text>
          ) : null}
          <View style={{marginTop: 20}}>
            <Button onPress={this.handleLogin}>Login</Button>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
