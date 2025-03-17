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

export default function Cadastro({ navigation }) {
  const [usuario, setUsuario] = useState({
    nomecompleto: "",
    cpf: "",
    email: "",
    password: "",
  });

  async function handleCadastro() {
    await api.postCadastro(usuario).then(
      (response) => {
        console.log(response.data.message);
        Alert.alert("OK", response.data.message);
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
        console.log(error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={require("../img/logosenai.png")} style={styles.logo} />
        <TextInput
          placeholder="Nome"
          value={usuario.nomecompleto}
          onChangeText={(value) => setUsuario({ ...usuario, nomecompleto: value })}
          style={styles.input}
        />
        <TextInput
          placeholder="E-mail"
          value={usuario.email}
          onChangeText={(value) => setUsuario({ ...usuario, email: value })}
          style={styles.input}
        />
        <TextInput
          placeholder="CPF"
          value={usuario.cpf}
          onChangeText={(value) => setUsuario({ ...usuario, cpf: value })}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={usuario.password}
          onChangeText={(value) => setUsuario({ ...usuario, password: value })}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleCadastro} style={styles.button}>
          <Text style={styles.buttonCadastrar}>Cadastrar-se</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.link}
        >
          <Text style={styles.linklogin}>Já tem uma conta? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffdcdc",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    padding: 20,
    borderWidth: 2,
    borderColor: "#A80805",
    borderRadius: 10,
    backgroundColor: "#fd7c7c",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
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
  button: {
    width: "100%",
    height: 50,
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
    color: "#A80805",
  },
  linklogin: {
    color: "#A80805",
    fontSize: 16,
  },
});
