import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import sheets from "../axios/axios";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const TelaDeReservasDoUsuario = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  // Para formatar a data da reserva
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const id = await SecureStore.getItemAsync("idUsuario");
      setUserId(id);

      if (id) {
        const response = await sheets.getReservas();
        const dados = response.data;

        if (dados && Array.isArray(dados.reserva_sala)) {
          const reservasDoUsuario = dados.reserva_sala.filter(
            (reserva) => reserva.fk_id_usuario.toString() === id.toString()
          );
          setReservas(reservasDoUsuario);
        } else {
          console.warn(
            "O array reserva_sala não foi encontrado no response:",
            dados
          );
        }
      }
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para editar
  const abrirModalEdicao = (reserva) => {
    setReservaSelecionada(reserva);
    setHorarioInicio(reserva.horario_inicio);
    setHorarioFim(reserva.horario_fim);
    setModalVisible(true);
  };

  // Atualizar reserva com os dados do modal
  const salvarEdicao = async () => {
    if (!horarioInicio || !horarioFim) {
      Alert.alert("Erro", "Preencha todos os campos de horário.");
      return;
    }

    try {
      const dadosAtualizados = {
        ...reservaSelecionada,
        horario_inicio: horarioInicio,
        horario_fim: horarioFim,
      };
      await sheets.updateReserva(
        reservaSelecionada.id_reserva,
        dadosAtualizados
      );
      Alert.alert("Sucesso", "Reserva atualizada!");
      setModalVisible(false);
      carregarDados();
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível atualizar a reserva.");
    }
  };

  // Deletar reserva
  const deletarReserva = async (idReserva) => {
    try {
      await sheets.deleteReserva(idReserva);
      Alert.alert("Sucesso", "Reserva deletada com sucesso!");
      carregarDados();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível deletar a reserva.");
      console.error(error);
    }
  };

  // Funções para controlar o picker de horário
  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);

  const handleConfirmStartTime = (date) => {
    setHorarioInicio(formatTime(date)); // <-- aqui está o erro principal
    hideStartTimePicker();
  };

  const handleConfirmEndTime = (date) => {
    setHorarioFim(formatTime(date));
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

  const renderItem = ({ item }) => (
    <View style={styles.reservaItem}>
      <Text>Sala: {item.fk_id_sala}</Text>
      <Text>Data: {new Date(item.data).toLocaleDateString()}</Text>
      <Text>
        Horário: {item.horario_inicio} - {item.horario_fim}
      </Text>
      <View style={styles.botoesContainer}>
        <Button
          title="Editar"
          onPress={() => abrirModalEdicao(item)}
          color="#1976D2"
        />
        <Button
          title="Excluir"
          onPress={() =>
            Alert.alert(
              "Confirmar exclusão",
              "Tem certeza que deseja deletar esta reserva?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Excluir",
                  style: "destructive",
                  onPress: () => deletarReserva(item.id_reserva),
                },
              ]
            )
          }
          color="#D32F2F"
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suas Reservas</Text>
      {reservas.length > 0 ? (
        <FlatList
          data={reservas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_reserva.toString()}
        />
      ) : (
        <Text>Você não tem nenhuma reserva.</Text>
      )}

      {/* Modal para edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Reserva</Text>

            <Text style={{ marginBottom: 5 }}>Horário Início</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={showStartTimePicker}
            >
              <Text>{horarioInicio || "Selecionar horário de início"}</Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 15, marginBottom: 5 }}>Horário Fim</Text>
            <TouchableOpacity style={styles.input} onPress={showEndTimePicker}>
              <Text>{horarioFim || "Selecionar horário de fim"}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmStartTime}
              onCancel={hideStartTimePicker}
            />

            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmEndTime}
              onCancel={hideEndTimePicker}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#1976D2" }]}
                onPress={salvarEdicao}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#D32F2F" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFDCDC",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  reservaItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TelaDeReservasDoUsuario;
