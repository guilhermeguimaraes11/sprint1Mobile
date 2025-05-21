import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Carrega dados salvos no AsyncStorage ao abrir a tela
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const nomeSalvo = await AsyncStorage.getItem("nome");
        const emailSalvo = await AsyncStorage.getItem("email");
        const senhaSalva = await AsyncStorage.getItem("senha");

        if (nomeSalvo) setNome(nomeSalvo);
        if (emailSalvo) setEmail(emailSalvo);
        if (senhaSalva) setSenha(senhaSalva);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // Função para salvar dados no AsyncStorage
  const salvarAlteracoes = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem("nome", nome);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("senha", senha);

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const sairSessao = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Sessão encerrada", "Você saiu da sessão com sucesso!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair da sessão.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#D32F2F" />
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

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
    backgroundColor: "#FFEBEE",
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
    color: "#B71C1C",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D32F2F",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: "#D32F2F",
    marginTop: 40,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#B71C1C",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
