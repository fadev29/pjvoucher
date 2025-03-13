import {Text} from '@react-navigation/elements';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
function Button({children, onPress}) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={[styles.button, isPressed && styles.buttonPressed]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={onPress}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF8B37',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  buttonPressed: {
    backgroundColor: '#FF8B37',
    transform: [{scale: 0.98}],
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button;
