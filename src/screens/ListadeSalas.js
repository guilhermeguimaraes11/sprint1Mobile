import React, { useState, useEffect } from 'react';  // Não se esqueça de importar o useEffect
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Button,
} from 'react-native';
import api from '../axios/axios'; // Importando a instância do axios


export default function ListaDeSalas({ navigation }) {
  const [salas, setSalas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);

  // Função assíncrona para buscar as salas
  async function getSalas() {
    try {
      const response = await api.get('/Salas'); // Certifique-se de que a URL está correta
      setSalas(response.data.salas);  // Supondo que a resposta tenha uma propriedade `salas`
    } catch (error) {
      console.error("Erro ao buscar salas", error);
    }
  }

  // useEffect para chamar a função getSalas quando o componente for montado
  useEffect(() => {
    getSalas();
  }, []); // O array vazio significa que a função será chamada apenas uma vez quando o componente for montado

  const openModal = (item) => {
    setSelectedSala(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSala(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nome}</Text>
      <Text style={styles.cell}>{item.descricao}</Text>
      <Text style={styles.cell}>{item.bloco}</Text>
      <Text style={styles.cell}>{item.tipo}</Text>
      <Text style={styles.cell}>{item.capacidade}</Text>
      <View style={styles.cell}>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NOME</Text>
        <Text style={styles.headerText}>DESCRIÇÃO</Text>
        <Text style={styles.headerText}>BLOCO</Text>
        <Text style={styles.headerText}>TIPO</Text>
        <Text style={styles.headerText}>CAPACIDADE</Text>
        <Text style={styles.headerText}>AÇÕES</Text>
      </View>

      <FlatList
        data={salas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por: Leonardo Pedroso, Guilherme Guimarães e Hyago</Text>
      </View>

      {/* Modal de Reserva */}
      {selectedSala && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeModal}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Reserva de Sala</Text>
              <Text>Nome: {selectedSala.nome}</Text>
              <Text>Descrição: {selectedSala.descricao}</Text>
              <Text>Bloco: {selectedSala.bloco}</Text>
              <Text>Tipo: {selectedSala.tipo}</Text>
              <Text>Capacidade: {selectedSala.capacidade}</Text>

              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => {
                  alert('Reserva realizada com sucesso!');
                  closeModal();
                }}
              >
                <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
              </TouchableOpacity>

              <Button title="Cancelar" onPress={closeModal} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFC2C2',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
  },
  footer: {
    padding: 10,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reserveButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
