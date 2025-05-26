import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const nomeSalvo = await AsyncStorage.getItem("nome");
        const emailSalvo = await AsyncStorage.getItem("email");
        const cpfSalvo = await AsyncStorage.getItem("cpf");

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
      await AsyncStorage.clear();
      Alert.alert("Sessão encerrada", "Você saiu da sessão com sucesso!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da sessão.");
      console.error("Erro ao sair:", error);
    }
  };

  const goToEditarReserva = () => {
    // Por enquanto, vamos navegar para a tela de edição sem dados específicos.
    // Em uma aplicação real, você precisaria selecionar uma reserva primeiro.
    navigation.navigate("EditarReserva", { reserva: { id: null, sala: '', data: '', horario: '' } });
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
      <Text style={styles.value}>{nome || "Não carregado"}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{email || "Não carregado"}</Text>

      <Text style={styles.label}>CPF:</Text>
      <Text style={styles.value}>{cpf || "Não carregado"}</Text>

      <TouchableOpacity style={styles.editReservasButton} onPress={goToEditarReserva}>
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
    color: "#FFDCDC"
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    color: "#730C0C",
  },
  value: {
    borderWidth: 1,
    borderColor: "#",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#FD7C7C",
    fontSize: 16,
    color: "#F5F5F5",
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: "#FA0505",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "FD7C7C",
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
    color: "FD7C7C",
    fontWeight: "bold",
    fontSize: 16,
  },
});