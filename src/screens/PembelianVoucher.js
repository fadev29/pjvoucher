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
import {dasbor} from '../api/dasbor';
import CheckBox from '../components/checkbox';

function PembelianVoucher() {
  const [jenisVoucher, setJenisVoucher] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [selectedJumlah, setSelectedJumlah] = useState(1);
  const [saldoUtama, setSaldoUtama] = useState(null);
  const [saldoBonus, setSaldoBonus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState('');
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBonus, setIsBonus] = useState(false);
  const [tipePengguna, setTipePengguna] = useState('pelanggan');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCheckboxToggle = () => {
    setIsBonus(prevState => !prevState);
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

  const fetchSaldo = useCallback(async () => {
    try {
      const response = await dasbor();
      if (response) {
        setSaldoUtama(response.saldo_utama);
        setSaldoBonus(response.saldo_bonus);
        setTipePengguna(response.tipe);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil data saldo');
    }
  }, []);

  useEffect(() => {
    fetchVoucher();
    fetchSaldo();
  }, [fetchVoucher, fetchSaldo]);

  const handlePembelianVoucher = async () => {
    if (!selectedVoucher || !selectedJumlah || !nama.trim()) {
      Alert.alert('Error', 'Pastikan semua data sudah terisi');
      return;
    }

    if (saldoUtama === 0 && saldoBonus === 0) {
      Alert.alert(
        'Gagal',
        'Saldo utama dan saldo bonus tidak mencukupi untuk pembelian.',
      );
      return;
    }

    let gunakanBonus = 0;
    if (isBonus && saldoBonus >= selectedJumlah) {
      gunakanBonus = 1;
    } else if (saldoUtama >= selectedJumlah) {
      gunakanBonus = 0;
    } else {
      Alert.alert(
        'Gagal',
        'Saldo utama tidak mencukupi dan saldo bonus tidak bisa digunakan.',
      );
      return;
    }

    setLoading(true);
    try {
      const response = await pembelianVoucher(
        selectedVoucher,
        nama,
        selectedJumlah,
        gunakanBonus,
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
      <View style={{flex: 1, backgroundColor: 'blue'}}>
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
            onChangeText={setNama}
            selectionColor="blue"
            placeholderTextColor="#888"
          />
          <Text style={styles.label}>Jumlah</Text>
          <Picker
            selectedValue={selectedJumlah}
            onValueChange={itemValue =>
              setSelectedJumlah(parseInt(itemValue, 10))
            }
            style={styles.picker}>
            {[...Array(10).keys()].map(i => (
              <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
            ))}
          </Picker>
          {tipePengguna === 'reseller' && (
            <View style={styles.checkboxContainer}>
              <CheckBox
                isChecked={isBonus}
                onPress={handleCheckboxToggle}
                label="Beli Pakai Saldo Bonus"
              />
            </View>
          )}

          <Button
            onPress={handlePembelianVoucher}
            disabled={loading || (saldoUtama === 0 && saldoBonus === 0)}>
            {loading ? 'Processing...' : 'Beli Voucher'}
          </Button>
        </View>
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
    color: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
    color: '#000',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    width: '100%',
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
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
  errorText: {
    color: 'red',
    fontSize: 18,
  },
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PembelianVoucher;
