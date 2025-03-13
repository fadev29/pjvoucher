import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {dasbor} from '../api/dasbor';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ThermalPrinterModule from 'react-native-thermal-printer';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);

  useEffect(() => {
    fetchTransactions();
    scanPrinters();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await dasbor();
      console.log('📥 API Response:', response);

      if (response && Array.isArray(response.transaksi)) {
        const uniqueTransactions = response.transaksi.map((item, index) => {
          return {
            ...item,
            uniqueKey: item.trx_print
              ? `${item.trx_print}-${index}`
              : `trx-${index}`,
          };
        });
        setTransactions(uniqueTransactions);
      } else {
        setError('Data transaksi tidak ditemukan');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Terjadi kesalahan saat mengambil data',
      );
    } finally {
      setLoading(false);
    }
  };

  // Scan for Bluetooth printers
  const scanPrinters = async () => {
    try {
      const devices = await ThermalPrinterModule.getBluetoothDeviceList();
      setPrinters(devices);
    } catch (error) {
      console.error('Error scanning printers:', error);
    }
  };

  // Print the transaction details
  const printText = async (macAddress, transaction) => {
    const [voucherCode, customerName] = transaction.keterangan.split(' Untuk');
    if (!macAddress) {
      Alert.alert(
        'No Printer Selected',
        'Please select a printer before printing.',
      );
      return;
    }

    try {
      const printPayload = `
===============================
        VOUCHER CODE
===============================
          ${voucherCode}
===============================
Pelanggan: ${customerName}
Tanggal: ${transaction.tanggal} WIB
===============================
        TERIMA KASIH
===============================
`;

      await ThermalPrinterModule.printBluetooth({
        payload: printPayload,
        printerAddr: macAddress,
        printerWidthMM: 58,
        printerNbrCharactersPerLine: 32,
      });
      Alert.alert('Print sent successfully!', 'Voucher printed successfully!');
    } catch (error) {
      console.error('Print failed:', error);
      Alert.alert('Print failed', 'An error occurred while printing');
    }
  };
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No transactions available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histori Transaksi</Text>

      <Text style={styles.title}>Pilih Printer</Text>
      {printers.length === 0 ? (
        <Text>No Bluetooth Printers Found</Text>
      ) : (
        printers.map((printer, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedPrinter(printer)}
            style={{
              padding: 10,
              backgroundColor: '#9747FF',
              marginBottom: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>
              {printer.deviceName || 'Unknown Printer'} ({printer.macAddress})
            </Text>
          </TouchableOpacity>
        ))
      )}

      <ScrollView>
        {transactions.map((transaction, index) => {
          const [voucherCode, customerName] =
            transaction.keterangan.split(' Untuk');

          return (
            <View key={transaction.uniqueKey}>
              <Image
                source={require('../components/images/VOUCHER2.jpg')}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 370,
                  height: 156,
                  marginTop: 20,
                }}
              />

              <Text
                style={{
                  fontWeight: 'bold',
                  marginTop: -150,
                  left: 70,
                  color: '#382A6B',
                }}>
                Tanggal: {'\n'}
                {transaction.tanggal} WIB
              </Text>

              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 15,
                  left: 70,
                  color: '#382A6B',
                }}>
                Pelanggan: {customerName}
              </Text>

              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 30,
                  color: '#382A6B',
                  left: 25,
                  top: 10,
                }}>
                {voucherCode}
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#382A6B',
                  width: 75,
                  height: 30,
                  top: -100,
                  left: 275,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                }}
                onPress={() =>
                  printText(selectedPrinter?.macAddress, transaction)
                }>
                <Icon name="print" size={20} color="#ECE7FC" />
                <Text style={{color: '#ECE7FC'}}>Cetak</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default History;
