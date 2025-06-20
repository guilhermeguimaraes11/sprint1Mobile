import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Header from "../components/Header"; // Importa o Header

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState({
    email: "",
    senha: "",
    showPassword: false,
  });

  async function handleLogin() {
    try {
      const response = await api.postLogin(usuario);
      const { message, token, user } = response.data;

      console.log(message);
      Alert.alert("OK", message);
      console.log("Token:", token);

      // Armazena dados com SecureStore
      await SecureStore.setItemAsync("idUsuario", user.id_usuario.toString());
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("nome", user.nomecompleto);
      await SecureStore.setItemAsync("email", user.email);
      await SecureStore.setItemAsync("cpf", user.cpf);

      navigation.navigate("ListaDeSalas");
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao fazer login.";
      Alert.alert("Erro", msg);
      console.error("Erro de login:", error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header com título "Login" */}
      <Header title="Login" />

      <View style={styles.formContainer}>
        <Image source={require("../img/logosenai.png")} style={styles.logo} />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="Digite seu E-mail"
          value={usuario.email}
          onChangeText={(value) => setUsuario({ ...usuario, email: value })}
          style={styles.input}
        />
        <Text style={styles.label}>Senha:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Digite sua Senha"
            value={usuario.senha}
            secureTextEntry={usuario.showPassword}
            onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() =>
              setUsuario({ ...usuario, showPassword: !usuario.showPassword })
            }
            style={styles.eyeIcon}
          >
            <Ionicons
              name={usuario.showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.buttonentrar}>
          <Text style={styles.buttonEntrar}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          style={styles.buttoncadastrese}
        >
          <Text style={styles.butoomCadastre}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomFooter}>
        <Text style={styles.footer}>
          Desenvolvido por Guilherme Guimaraes, Hyago Gabriel e Leonardo Pedroso
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffdcdc",
    padding: 0,
  },
  formContainer: {
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderColor: "#A80805",
    borderRadius: 15,
    backgroundColor: "#fd7c7c",
  },
  logo: {
    width: 250,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonentrar: {
    width: "100%",
    height: 50,
    backgroundColor: "#A80805",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonEntrar: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttoncadastrese: {
    marginTop: 10,
    alignItems: "center",
  },
  butoomCadastre: {
    color: "#A80805",
    fontSize: 16,
  },
  footer: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
    padding: 23,
    backgroundColor: "#D32F2F",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 18,
    top: 12,
  },
});
