import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import ThermalPrinterModule from 'react-native-thermal-printer';

function DetailPembelian({route}) {
  const {voucherData} = route.params;

  console.log('DetailPembelian Data:', voucherData);

  const transaksi = voucherData?.transaksi || [];
  const jumlahPembelian = transaksi.length;

  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  useEffect(() => {
    if (jumlahPembelian > 0) {
      ToastAndroid.show(
        `✅ Pembelian ${jumlahPembelian} Voucher Berhasil`,
        ToastAndroid.SHORT,
      );
    }
    scanPrinters();
  }, [jumlahPembelian]);

  const scanPrinters = async () => {
    try {
      const devices = await ThermalPrinterModule.getBluetoothDeviceList();
      setPrinters(devices);
    } catch (error) {
      console.error('Error scanning printers:', error);
      ToastAndroid.show('Gagal memindai printer', ToastAndroid.SHORT);
    }
  };

  const handlePrint = async transaksiDetail => {
    const [customerName, tanggal] = transaksiDetail.nama_pelanggan.split('  ');
    if (!selectedPrinter) {
      Alert.alert(
        'Printer Belum Dipilih',
        'Silakan pilih printer sebelum mencetak.',
      );
      return;
    }

    try {
      console.log('🖨️ Mencoba mencetak voucher:', transaksiDetail);

      const printText = `
===============================
        VOUCHER CODE
===============================
           ${transaksiDetail.voucher}
===============================
reseller: ${transaksiDetail.nama_reseller}
Pelanggan: ${customerName}
Tanggal: ${tanggal} WIB
Jenis Voucher:  ${transaksiDetail.jenis_voucher}
===============================
        TERIMA KASIH
===============================
`;

      await ThermalPrinterModule.printBluetooth({
        payload: printText,
        printerAddr: selectedPrinter.macAddress,
        printerWidthMM: 58,
        printerNbrCharactersPerLine: 32,
      });

      console.log('✅ Voucher berhasil dikirim ke printer');
      ToastAndroid.show('🖨️ Voucher dicetak!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('❌ Gagal mencetak:', error);
      Alert.alert('Error', 'Gagal mencetak: ' + error.message);
    }
  };

  if (jumlahPembelian === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Data tidak ditemukan</Text>
      </View>
    );
  }

  const handlePrintAll = async () => {
    if (!selectedPrinter) {
      Alert.alert(
        'Printer Belum Dipilih',
        'Silakan pilih printer sebelum mencetak.',
      );
      return;
    }

    try {
      for (const transaksiDetail of transaksi) {
        const [customerName, tanggal] =
          transaksiDetail.nama_pelanggan.split('  ');
        const printText = `
===============================
        VOUCHER CODE
===============================
           ${transaksiDetail.voucher}
===============================
reseller: ${transaksiDetail.nama_reseller}
Pelanggan: ${customerName}
Tanggal: ${tanggal} WIB
Jenis Voucher:  ${transaksiDetail.jenis_voucher}
===============================
        TERIMA KASIH
===============================
`;

        await ThermalPrinterModule.printBluetooth({
          payload: printText,
          printerAddr: selectedPrinter.macAddress,
          printerWidthMM: 58,
          printerNbrCharactersPerLine: 32,
        });

        console.log(`✅ Voucher ${transaksiDetail.voucher} dicetak`);
      }

      ToastAndroid.show('🖨️ Semua voucher dicetak!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('❌ Gagal mencetak semua voucher:', error);
      Alert.alert('Error', 'Gagal mencetak semua voucher: ' + error.message);
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#007AFF'}}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginTop: 20,
          marginLeft: 20,
          color: '#fff',
        }}>
        Informasi Voucher
      </Text>
      <Text
        style={{fontSize: 16, marginTop: 10, marginLeft: 20, color: '#fff'}}>
        {jumlahPembelian} Voucher
      </Text>

      <Text
        style={{fontSize: 16, marginTop: 20, marginLeft: 20, color: '#fff'}}>
        Pilih Printer:
      </Text>
      {printers.length === 0 ? (
        <Text style={{marginLeft: 20, color: '#fff'}}>
          Tidak ada printer ditemukan
        </Text>
      ) : (
        printers.map((printer, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedPrinter(printer)}
            style={{
              padding: 10,
              margin: 10,
              backgroundColor:
                selectedPrinter?.macAddress === printer.macAddress
                  ? '#FF8000'
                  : '#cccccc',
              marginBottom: 10,
              borderRadius: 5,
            }}>
            <Text style={{color: 'white'}}>
              {printer.deviceName || 'Unknown Printer'} ({printer.macAddress})
            </Text>
          </TouchableOpacity>
        ))
      )}

      {transaksi.length > 1 && (
        <TouchableOpacity
          onPress={handlePrintAll}
          style={{
            backgroundColor: '#FF8000',
            padding: 12,
            borderRadius: 10,
            alignSelf: 'center',
            marginVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            left: 80,
          }}>
          <Icon name="print" size={22} color="#Ffff" />
          <Text style={{color: '#ECE7FC', fontSize: 16, fontWeight: 'bold'}}>
            Cetak Semua Voucher
          </Text>
        </TouchableOpacity>
      )}

      {transaksi.map((transaksiDetail, index) => (
        <View key={index} style={{marginBottom: 5}}>
          <Image
            source={require('../components/images/VOUCHER1.jpg')}
            style={{
              width: 370,
              height: 156,
              alignSelf: 'center',
              marginTop: 20,
            }}
          />

          <Text
            style={{
              fontWeight: 'bold',
              marginTop: -150,
              left: 85,
              color: '#fff',
            }}>
            Jenis Voucher: {transaksiDetail.jenis_voucher}
          </Text>
          <Text style={{left: 85, color: '#fff', top: 10}}>
            reseller: {transaksiDetail.nama_reseller}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              marginTop: 20,
              left: 85,
              color: '#fff',
              fontSize: 12.5,
            }}>
            Pelanggan: {transaksiDetail.nama_pelanggan}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              marginTop: 30,
              textAlign: 'center',
              fontSize: 30,
              color: '#fff',
            }}>
            {transaksiDetail.voucher}
          </Text>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              backgroundColor: '#FF8B37',
              width: 75,
              height: 30,
              top: -140,
              left: 280,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
              borderRadius: 5,
            }}
            onPress={() => handlePrint(transaksiDetail)}>
            <Icon name="print" size={20} color="#ECE7FC" />
            <Text style={{color: '#ECE7FC'}}>Cetak</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

export default DetailPembelian;
