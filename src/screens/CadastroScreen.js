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
    senha: "",
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
        <TextInput
          placeholder="Digite sua Senha"
          value={usuario.senha}
          onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
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
      <Text style={styles.footer}>
        Desenvolvido por Guilherme Guimaraes, Hyago Gabriel e Leonardo Pedroso
      </Text>
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
    width: "90%",
    maxWidth: 400,
    padding: 15,
    borderWidth: 2,
    borderColor: "#A80805",
    borderRadius: 10,
    backgroundColor: "#fd7c7c",
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 5,
  },

  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  input: {
    width: "100%",
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
    color: "#A80805",
  },
  linklogin: {
    color: "#A80805",
    fontSize: 16,
  },
  footer: {
    color: "black",
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
  },
});
