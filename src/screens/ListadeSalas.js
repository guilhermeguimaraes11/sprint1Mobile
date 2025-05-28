import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function ListaDeSalas({ navigation }) {
  const [salas, setSalas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [searchText, setSearchText] = useState("");

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const verificarDisponibilidade = async (sala) => {
    try {
      const hoje = new Date().toISOString().split("T")[0];
      const response = await api.getDisponibilidadeSala(sala.id_sala, hoje);
      alert(
        `Disponibilidade em ${hoje}: ${
          response.data.disponivel ? "Disponível" : "Indisponível"
        }`
      );
    } catch (error) {
      console.error("Erro ao verificar disponibilidade", error);
      alert(error.response?.data?.error || "Erro ao verificar disponibilidade.");
    }
  };

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.salas);
    } catch (error) {
      console.error("Erro ao buscar salas", error);
      alert(error.response?.data?.error || "Erro inesperado");
    }
  }

  useEffect(() => {
    getSalas();
  }, []);

  const openModal = (item) => {
    setSelectedSala(item);
    setModalVisible(true);
    // Reseta os horários ao abrir modal
    setSelectedDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSala(null);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("idUsuario");
      alert("Você foi desconectado.");
      navigation.navigate("Login");
    } catch (error) {
      alert("Erro ao tentar deslogar. Tente novamente.");
    }
  };

  const filteredSalas = salas.filter((sala) =>
    sala.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.nome}</Text>
      <Text style={styles.cell}>{item.descricao}</Text>
      <Text style={styles.cell}>{item.bloco}</Text>
      <Text style={styles.cell}>{item.tipo}</Text>
      <Text style={styles.cell}>{item.capacidade}</Text>
      <View style={styles.cell}>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={styles.actionButton}
        >
          <Text style={styles.actionButtonText}>Reservar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => verificarDisponibilidade(item)}
          style={[styles.actionButton, { marginTop: 5, backgroundColor: "#9C27B0" }]}
        >
          <Text style={styles.actionButtonText}>Disponibilidade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Funções para controlar o picker de horário
  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);

  const handleConfirmStartTime = (date) => {
    setStartTime(date);
    hideStartTimePicker();
  };

  const handleConfirmEndTime = (date) => {
    setEndTime(date);
    hideEndTimePicker();
  };

  // Função para formatar a data em YYYY-MM-DD para enviar na reserva
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Função para formatar o horário em HH:mm
  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>Lista de Salas</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("Perfil")}
            accessibilityLabel="Ir para perfil"
          >
            <MaterialIcons name="account-circle" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerLogoutButton} onPress={handleLogout}>
            <Text style={styles.headerLogoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>NOME</Text>
        <Text style={styles.headerText}>DESCRIÇÃO</Text>
        <Text style={styles.headerText}>BLOCO</Text>
        <Text style={styles.headerText}>TIPO</Text>
        <Text style={styles.headerText}>CAPACIDADE</Text>
        <Text style={styles.headerText}>AÇÕES</Text>
      </View>

      <TextInput
        placeholder="Buscar sala"
        style={styles.searchInput}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      <FlatList
        data={filteredSalas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_sala.toString()}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido por: Leonardo Pedroso, Guilherme Guimarães e Hyago
        </Text>
      </View>

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
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reserva de Sala</Text>
              <Text>Nome: {selectedSala.nome}</Text>
              <Text>Descrição: {selectedSala.descricao}</Text>
              <Text>Bloco: {selectedSala.bloco}</Text>
              <Text>Tipo: {selectedSala.tipo}</Text>
              <Text>Capacidade: {selectedSala.capacidade}</Text>

              <Text style={styles.label}>Data da Reserva (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Ex: 2025-05-06"
                value={formatDate(selectedDate)}
                onChangeText={(text) => setSelectedDate(new Date(text))}
              />

              <Text style={styles.label}>Horário de Início:</Text>
              <TouchableOpacity onPress={showStartTimePicker} style={styles.searchInput}>
                <Text>{formatTime(startTime)}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmStartTime}
                onCancel={hideStartTimePicker}
              />

              <Text style={styles.label}>Horário de Fim:</Text>
              <TouchableOpacity onPress={showEndTimePicker} style={styles.searchInput}>
                <Text>{formatTime(endTime)}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmEndTime}
                onCancel={hideEndTimePicker}
              />

              <TouchableOpacity
                style={styles.reserveButton}
                onPress={async () => {
                  try {
                    const idUsuario = await AsyncStorage.getItem("idUsuario");
                    if (!idUsuario) {
                      alert("Usuário não autenticado.");
                      return;
                    }

                    const reserva = {
                      data: formatDate(selectedDate),
                      horario_inicio: formatTime(startTime),
                      horario_fim: formatTime(endTime),
                      fk_id_sala: selectedSala.id_sala,
                      fk_id_usuario: parseInt(idUsuario),
                    };

                    const response = await api.postReserva(reserva);
                    alert(response.data.message);
                    closeModal();
                  } catch (error) {
                    alert(error.response?.data?.error || "Erro inesperado");
                  }
                }}
              >
                <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reserveButton} onPress={closeModal}>
                <Text style={styles.reserveButtonText}>Cancelar</Text>
              </TouchableOpacity>
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
    backgroundColor: "#FFEBEE",
  },
  customHeader: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerLogoutButton: {
    backgroundColor: "#B71C1C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  headerLogoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerText: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFC2C2",
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 12,
    color: "#000",
  },
  footer: {
    padding: 10,
    backgroundColor: "#D32F2F",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginVertical: 5,
  },
  reserveButton: {
    backgroundColor: "#D32F2F",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#FFCCCC",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    borderWidth: 0.5,
    borderColor: "#C0C0C0",
    minWidth: 120,
  },
});
