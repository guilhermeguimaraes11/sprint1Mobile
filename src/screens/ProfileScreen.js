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
  import api from "../axios/axios";

  export default function PerfilScreen({ navigation }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [idUsuario, setIdUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
        await SecureStore.deleteItemAsync("idUsuario");

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
      if (!idUsuario) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        return;
      }

      setSaving(true);
      try {

        console.log(nome)
        console.log(email)
        console.log(idUsuario)


        const response = await api.updateUsuario(idUsuario, {
          nomecompleto: nome,
          email: email,
          cpf: cpf,
        });

        Alert.alert("Sucesso", response.data.message);

        await SecureStore.setItemAsync("nome", nome);
        await SecureStore.setItemAsync("email", email);

      } catch (error) {
        Alert.alert("Erro", error.response.data.error);
        console.error("Erro ao salvar alterações:", error.response.data.error);
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
          style={[styles.input, { backgroundColor: "#e6e6e6", color: "#999" }]}
          value={cpf}
          editable={false}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarAlteracoes}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Text>
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
