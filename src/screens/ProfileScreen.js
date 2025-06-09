import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const nomeSalvo = await SecureStore.getItemAsync("nome");
        const emailSalvo = await SecureStore.getItemAsync("email");
        const cpfSalvo = await SecureStore.getItemAsync("cpf");

        if (nomeSalvo) setNome(nomeSalvo);
        if (emailSalvo) setEmail(emailSalvo);
        if (cpfSalvo) setCpf(cpfSalvo);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const sairSessao = async () => {
    try {
      await SecureStore.deleteItemAsync("nome");
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("cpf");
      await SecureStore.deleteItemAsync("token");

      Alert.alert("Sessão encerrada", "Você saiu da sessão com sucesso!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da sessão.");
      console.error("Erro ao sair:", error);
    }
  };

  const goToEditarReserva = () => {
    navigation.navigate("EditarReserva", {
      reserva: { id: null, sala: "", data: "", horario: "" },
    });
  };

  const salvarAlteracoes = async () => {
    setSaving(true);

    try {
      // Aqui você pode implementar o fetch para a API que atualiza o usuário
      // Exemplo:
      // await fetch("API_URL/usuario/:id", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ nomecompleto: nome, email, cpf }),
      // });

      // Também salve localmente as alterações:
      await SecureStore.setItemAsync("nome", nome);
      await SecureStore.setItemAsync("email", email);
      await SecureStore.setItemAsync("cpf", cpf);

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
      console.error("Erro ao salvar alterações:", error);
    } finally {
      setSaving(false);
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
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        placeholder="Digite seu CPF"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? "Salvando..." : "Salvar Alterações"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editReservasButton}
        onPress={goToEditarReserva}
      >
        <Text style={styles.editReservasButtonText}>Minhas Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={sairSessao}>
        <Text style={styles.logoutButtonText}>Sair da Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFDCDC",
    flex: 1,
    color: "#FFDCDC",
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
});
