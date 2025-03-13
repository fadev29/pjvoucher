import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (token) {
        this.props.navigation.dispatch(StackActions.replace('Home'));
      } else {
        this.props.navigation.dispatch(StackActions.replace('Login'));
      }
    } catch (error) {
      console.error('Error checking auth token:', error);
      this.props.navigation.dispatch(StackActions.replace('Login'));
    }
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../components/images/logoPJV.jpg')}
          style={{width: 85.08, height: 265}}
        />
      </View>
    );
  }
}

export default SplashScreen;
