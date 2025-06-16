import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";

export default function PerfilScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal personalizado
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); // info, success, error

  // Modal de confirmação de exclusão
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const nomeSalvo = await SecureStore.getItemAsync("nome");
        const emailSalvo = await SecureStore.getItemAsync("email");
        const cpfSalvo = await SecureStore.getItemAsync("cpf");
        const idSalvo = await SecureStore.getItemAsync("idUsuario");

        if (nomeSalvo) setNome(nomeSalvo);
        if (emailSalvo) setEmail(emailSalvo);
        if (cpfSalvo) setCpf(cpfSalvo);
        if (idSalvo) setIdUsuario(idSalvo);
      } catch (error) {
        mostrarModal("Erro", "Não foi possível carregar os dados do perfil.", "error");
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const mostrarModal = (title, message, type = "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const sairSessao = async () => {
    try {
      await SecureStore.deleteItemAsync("nome");
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("cpf");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("idUsuario");

      mostrarModal("Sessão encerrada", "Você saiu da sessão com sucesso!", "success");
      navigation.replace("Login");
    } catch (error) {
      mostrarModal("Erro", "Não foi possível sair da sessão.", "error");
      console.error("Erro ao sair:", error);
    }
  };

  const goToEditarReserva = () => {
    navigation.navigate("EditarReserva", {
      reserva: { id: null, sala: "", data: "", horario: "" },
    });
  };

  const salvarAlteracoes = async () => {
    if (!idUsuario) {
      mostrarModal("Erro", "ID do usuário não encontrado.", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await api.updateUsuario(idUsuario, {
        nomecompleto: nome,
        email: email,
        cpf: cpf,
      });

      mostrarModal("Sucesso", response.data.message, "success");

      await SecureStore.setItemAsync("nome", nome);
      await SecureStore.setItemAsync("email", email);
    } catch (error) {
      mostrarModal("Erro", error.response?.data?.error || "Erro ao salvar alterações.", "error");
      console.error("Erro ao salvar alterações:", error.response?.data?.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletarConta = async () => {
    setConfirmDeleteModalVisible(false);
    try {
      const idUsuarioStr = await SecureStore.getItemAsync("idUsuario");
      if (!idUsuarioStr) {
        mostrarModal("Erro", "ID do usuário não encontrado.", "error");
        return;
      }
      const idUsuario = Number(idUsuarioStr);

      const deleteResponse = await api.deleteUsuario(idUsuario);

      mostrarModal("Conta excluída", deleteResponse.data.message || "Sua conta foi excluída com sucesso.", "success");

      await SecureStore.deleteItemAsync("nome");
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("cpf");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("idUsuario");

      navigation.replace("Login");
    } catch (deleteError) {
      console.error("Erro ao deletar conta:", deleteError);
      const mensagemErro = deleteError.response?.data?.error || "Erro ao deletar sua conta.";
      mostrarModal("Erro", mensagemErro, "error");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#730C0C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>CPF:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#e6e6e6", color: "#999" }]}
        value={cpf}
        editable={false}
      />

      <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes} disabled={saving}>
        <Text style={styles.saveButtonText}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editReservasButton} onPress={goToEditarReserva}>
        <Text style={styles.editReservasButtonText}>Minhas Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={sairSessao}>
        <Text style={styles.logoutButtonText}>Sair da Sessão</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setConfirmDeleteModalVisible(true)}
      >
        <Text style={styles.deleteButtonText}>Excluir Conta</Text>
      </TouchableOpacity>

      {/* Modal de confirmação de exclusão */}
      <Modal transparent visible={confirmDeleteModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalText}>Tem certeza que deseja excluir sua conta?</Text>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setConfirmDeleteModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleDeletarConta}>
                <Text style={styles.confirmButton}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de mensagens */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, modalType === "error" && { color: "#FF3B30" }]}>
              {modalTitle}
            </Text>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
              <Text style={styles.confirmButton}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFDCDC",
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    color: "#730C0C",
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#FD7C7C",
    fontSize: 16,
    color: "#F5F5F5",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#0A84FF",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#FA0505",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FD7C7C",
    fontWeight: "bold",
    fontSize: 16,
  },
  editReservasButton: {
    backgroundColor: "#11CB0A",
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  editReservasButtonText: {
    color: "#FD7C7C",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#730C0C",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFDCDC",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#730C0C",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 25,
  },
  cancelButton: {
    color: "#888",
    fontSize: 16,
    padding: 10,
  },
  confirmButton: {
    color: "#FA0505",
    fontWeight: "bold",
    fontSize: 16,
    padding: 10,
  },
});
