import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const PassengerCountField = () => {
  const [passengerCount, setPassengerCount] = useState('');

  const handlePassengerCountChange = (text) => {
    const isValidNumber = /^\d+$/.test(text);
    if (isValidNumber) {
      setPassengerCount(text);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.textInput}
        keyboardType='numeric'
        onChangeText={handlePassengerCountChange}
        value={passengerCount}
        placeholder='Nombre de passager(s)'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
});

export default PassengerCountField;