import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {belivoucher, pembelianVoucher} from '../api/pembelianvoucher';
import Button from '../components/button';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

function PembelianVoucher() {
  const [jenisVoucher, setJenisVoucher] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [selectedJumlah, setSelectedJumlah] = useState('1');
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState('');
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const fetchVoucher = useCallback(async () => {
    setLoading(true);
    try {
      const response = await belivoucher();
      if (response && Array.isArray(response.jenis_voucher)) {
        setJenisVoucher(response.jenis_voucher);
      } else {
        Alert.alert('Error', 'Data voucher tidak ditemukan');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal mengambil data voucher');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVoucher();
  }, [fetchVoucher]);

  const handlePembelianVoucher = async () => {
    if (!selectedVoucher || !selectedJumlah || !nama.trim()) {
      Alert.alert('Error', 'Pastikan semua data sudah terisi');
      return;
    }

    setLoading(true);
    try {
      const response = await pembelianVoucher(
        selectedVoucher,
        nama,
        selectedJumlah,
      );
      if (response) {
        toggleModal();
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('DetailPembelian', {
            voucherData: response,
          });
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Gagal membeli voucher');
    } finally {
      setLoading(false);
    }
  };

  if (loading && jenisVoucher.length === 0) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut">
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Pembelian Berhasil!</Text>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Pembelian Voucher</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Jenis Voucher</Text>
        {jenisVoucher.length > 0 ? (
          <Picker
            selectedValue={selectedVoucher}
            onValueChange={itemValue => setSelectedVoucher(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Pilih Voucher" value="" />
            {jenisVoucher.map((voucher, index) => (
              <Picker.Item
                key={index}
                label={voucher.select}
                value={voucher.value}
              />
            ))}
          </Picker>
        ) : (
          <Text style={styles.errorText}>Tidak ada voucher tersedia</Text>
        )}
        <Text style={styles.label}>HP/Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama/No HP Pelanggan"
          value={nama}
          onChangeText={text => setNama(text)}
          selectionColor="blue"
          placeholderTextColor="#888"
        />
        <Text style={styles.label}>Jumlah</Text>
        <Picker
          selectedValue={selectedJumlah}
          onValueChange={itemValue => setSelectedJumlah(itemValue)}
          style={styles.picker}>
          {[...Array(10).keys()].map(i => (
            <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
          ))}
        </Picker>
        <Button onPress={handlePembelianVoucher} disabled={loading}>
          {loading ? 'Processing...' : 'Beli Voucher'}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#D7CDFA',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    color: '#888',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#D7CDFA',
    padding: 10,
    width: '100%',
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default PembelianVoucher;
