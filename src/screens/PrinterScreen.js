import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import ThermalPrinterModule from 'react-native-thermal-printer';

const PrinterScreen = () => {
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    scanPrinters();
  }, []);

  const scanPrinters = async () => {
    try {
      const devices = await ThermalPrinterModule.getBluetoothDeviceList();
      setPrinters(devices);
    } catch (error) {
      console.error('Error scanning printers:', error);
    }
  };

  const printText = async macAddress => {
    try {
      await ThermalPrinterModule.printBluetooth({
        payload: 'Hello, this is a test print!',
        printerAddr: macAddress,
        printerWidthMM: 58,
        printerNbrCharactersPerLine: 32,
      });
      alert('Print sent successfully!');
    } catch (error) {
      console.error('Print failed:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'blue'}}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          flexGrow: 1,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#fff',
          }}>
          Bluetooth Printers:
        </Text>
        {printers.map((printer, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => printText(printer.macAddress)}
            style={{
              padding: 10,
              backgroundColor: '#FF8B37',
              marginBottom: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>
              {printer.deviceName || 'Unknown Printer'} ({printer.macAddress})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrinterScreen;
