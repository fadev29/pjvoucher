import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const underlineWidth = new Animated.Value(0);

  const handlePress = tab => {
    setActiveTab(tab);
    Animated.timing(underlineWidth, {
      toValue: 40,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const renderTab = (name, icon) => (
    <TouchableOpacity
      onPress={() => handlePress(name)}
      style={{alignItems: 'center'}}>
      <Icon
        name={icon}
        size={30}
        color={activeTab === name ? '#FF8B37' : '#fff'}
      />
      <Text style={{color: '#fff', textAlign: 'center'}}>{name}</Text>
      {activeTab === name && (
        <Animated.View
          style={{
            width: underlineWidth,
            height: 4,
            backgroundColor: '#FF8B37',
            marginTop: 5,
            borderRadius: 10,
          }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        backgroundColor: 'blue',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 9,
      }}>
      {renderTab('Home', 'house')}
      {renderTab('Notifications', 'bell')}
      {renderTab('Settings', 'gear')}
      {renderTab('Search', 'magnifying-glass')}
    </View>
  );
};

export default Navbar;
