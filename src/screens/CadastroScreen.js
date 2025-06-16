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
import { Ionicons } from "@expo/vector-icons";
import api from "../axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header"; // Importa o Header

export default function Cadastro({ navigation }) {
  const [usuario, setUsuario] = useState({
    nomecompleto: "",
    cpf: "",
    email: "",
    senha: "",
    showPassword: false, //(oculta ou visível)
  });

  async function handleCadastro() {
    // Envia os dados de cadastro para a API e trata a resposta
    await api.postCadastro(usuario).then(
      (response) => {
        console.log(response.data.message);
        AsyncStorage.setItem("token", response.data.token)
        Alert.alert("OK", response.data.message);
        navigation.navigate("Login");
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error); // Exibe um alerta caso ocorra erro
        console.log(error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Cadastro" />
      <View style={styles.formContainer}>
        <Image source={require("../img/logosenai.png")} style={styles.logo} />

        {/* Campo para nome completo */}
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          placeholder="Nome Completo"
          value={usuario.nomecompleto}
          onChangeText={(value) =>
            setUsuario({ ...usuario, nomecompleto: value })
          }
          style={styles.input}
        />

        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          placeholder="Digite seu E-mail"
          value={usuario.email}
          onChangeText={(value) => setUsuario({ ...usuario, email: value })}
          style={styles.input}
        />

        <Text style={styles.label}>CPF:</Text>
        <TextInput
          placeholder="Digite seu CPF"
          value={usuario.cpf}
          onChangeText={(value) => setUsuario({ ...usuario, cpf: value })}
          style={styles.input}
        />

        <Text style={styles.label}>Senha:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Digite sua Senha"
            value={usuario.senha}
            onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
            secureTextEntry={usuario.showPassword}
            style={styles.input}
          />
          {/* Ícone para mostrar ou ocultar a senha */}
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

        <TouchableOpacity onPress={handleCadastro} style={styles.button}>
          <Text style={styles.buttonCadastrar}>Cadastrar-se</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.link}
        >
          <Text style={styles.jatemumalogin}>Já tem uma conta? Login</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Desenvolvido por Guilherme Guimaraes, Hyago Gabriel e Leonardo Pedroso
      </Text>
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

  label: {
    fontSize: 16,
    marginBottom: 5,
  },

  input: {
    width: "100%", //
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#A80805",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  buttonCadastrar: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  link: {
    marginTop: 10,
    alignItems: "center",
  },

  jatemumalogin: {
    color: "#A80805",
    fontSize: 16,
  },

  footer: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
    width:"100%",
    padding: 23,
    backgroundColor: "#D32F2F",
    alignItems: "center",
  },

  eyeIcon: {
    position: "absolute",
    right: 18,
    top: 12,
  },
});