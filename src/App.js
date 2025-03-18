import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/splacescreens';
import Login from './screens/Login';
import Home from './screens/Home';
import History from './screens/History';
import DetailPembelian from './screens/DetailPembelian';
import PembelianVoucher from './screens/PembelianVoucher';
import ProfileUser from './screens/ProfileUser';
import GantiPassword from './screens/GantiPassword';
import PrinterScreen from './screens/PrinterScreen';
import HistoryPelanggan from './screens/HistoryPelanggan';
import DetailPembelianPelanggan from './screens/DetailPembelianPelanggan';
import {navigationRef} from './navigation/navigationService';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DetailPembelian" component={DetailPembelian} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="PembelianVoucher" component={PembelianVoucher} />
        <Stack.Screen name="ProfileUser" component={ProfileUser} />
        <Stack.Screen name="GantiPassword" component={GantiPassword} />
        <Stack.Screen name="PrinterScreen" component={PrinterScreen} />
        <Stack.Screen name="HistoryPelanggan" component={HistoryPelanggan} />
        <Stack.Screen
          name="DetailPembelianPelanggan"
          component={DetailPembelianPelanggan}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
