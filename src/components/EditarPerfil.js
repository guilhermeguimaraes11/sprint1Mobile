import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../axios/axios";

export default function EditarPerfil({ visible, onClose, user, onUpdate }) {
  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);

  const handleSave = async () => {
    try {
      const response = await api.updateUser(user.id_usuario, {
        nome,
        email,
        senha: "********",
        cpf: user.cpf,
      });
      onUpdate({ ...user, nome, email });
      Alert.alert("OK", response.data.message);
      onClose();
    } catch (error) {
      console.log(
        "Erro ao atualizar usuário:",
        error.response?.data || error.message
      );
      Alert.alert("Erro", "Não foi possível atualizar as informações.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.titulo}>Editar Perfil</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
          />

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSalvar} onPress={handleSave}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 5,
    borderRadius: 6,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  botaoCancelar: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  botaoSalvar: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  textoBotao: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
