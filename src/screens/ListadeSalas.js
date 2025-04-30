import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  Modal, TouchableOpacity, TextInput, Button, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function ListaDeSalas() {
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);
  const [formData, setFormData] = useState({ data: '', horarioInicio: '', horarioFim: '' });
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalas();
    fetchReservas();
  }, []);

  const fetchSalas = async () => {
    try {
      const response = await api.get();
      setSalas(response.data.salas);
    } catch (error) {
      console.error('Erro ao buscar salas', error);
    }
  };

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservaschedule');
      setReservas(response.data.reservas);
    } catch (error) {
      console.error('Erro ao buscar reservas', error);
    }
  };

  const isSalaReservada = (salaId) => {
    return reservas.some((reserva) => reserva.fk_id_sala === salaId);
  };

  const openModal = (sala) => {
    setSelectedSala(sala);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedSala(null);
    setFormData({ data: '', horarioInicio: '', horarioFim: '' });
    setModalVisible(false);
  };

  const handleReserva = async () => {
    if (!selectedSala) return;
    setLoading(true);
    try {
      const id_usuario = await AsyncStorage.getItem('id_usuario');
      await api.post( {
        data: formData.data,
        horario_inicio: formData.horarioInicio,
        horario_fim: formData.horarioFim,
        fk_id_sala: selectedSala.id_sala,
        fk_id_usuario: id_usuario,
      });
      await fetchReservas();
      closeModal();
      Alert.alert("Sucesso", "Reserva realizada com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao reservar sala");
    } finally {
      setLoading(false);
    }
  };

  const salasFiltradas = salas.filter((sala) => {
    const termo = filtro.toLowerCase();
    return (
      sala.nome.toLowerCase().includes(termo) ||
      sala.descricao.toLowerCase().includes(termo) ||
      sala.bloco.toLowerCase().includes(termo) ||
      sala.tipo.toLowerCase().includes(termo)
    );
  });

  const renderItem = ({ item }) => {
    const reservada = isSalaReservada(item.id_sala);
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.nome}</Text>
        <Text style={styles.cell}>{item.descricao}</Text>
        <Text style={styles.cell}>{item.bloco}</Text>
        <Text style={styles.cell}>{item.tipo}</Text>
        <Text style={styles.cell}>{item.capacidade}</Text>
        <TouchableOpacity
          disabled={reservada}
          style={[styles.reserveButton, reservada && styles.disabledButton]}
          onPress={() => openModal(item)}
        >
          <Text style={styles.reserveButtonText}>
            {reservada ? "Reservada" : "Reservar"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar sala"
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={salasFiltradas}
        keyExtractor={(item) => item.id_sala.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.cell}>Nenhuma sala encontrada</Text>}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reservar Sala</Text>
            <Text style={styles.modalText}>{selectedSala?.nome}</Text>

            <TextInput
              placeholder="Data (YYYY-MM-DD)"
              style={styles.input}
              value={formData.data}
              onChangeText={(text) => setFormData({ ...formData, data: text })}
            />
            <TextInput
              placeholder="Horário Início (HH:MM)"
              style={styles.input}
              value={formData.horarioInicio}
              onChangeText={(text) => setFormData({ ...formData, horarioInicio: text })}
            />
            <TextInput
              placeholder="Horário Fim (HH:MM)"
              style={styles.input}
              value={formData.horarioFim}
              onChangeText={(text) => setFormData({ ...formData, horarioFim: text })}
            />

            <TouchableOpacity style={styles.reserveButton} onPress={handleReserva} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
              )}
            </TouchableOpacity>
            <Button title="Cancelar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEBEE', padding: 10 },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'column',
    backgroundColor: '#FFC2C2',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  cell: { fontSize: 14, marginBottom: 3, color: '#000' },
  reserveButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  disabledButton: { backgroundColor: '#999' },
  reserveButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 10 },
  input: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
