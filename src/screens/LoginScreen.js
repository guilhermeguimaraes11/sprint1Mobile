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

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState({
    email: "",
    senha: "",
  });

  async function handleLogin() {
    await api.postLogin(usuario).then(
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
      {/* Footer Superior */}
      <View style={styles.topFooter}></View>

      <View style={styles.formContainer}>
        <Image source={require("../img/logosenai.png")} style={styles.logo} />

        <TextInput
          placeholder="E-mail"
          value={usuario.email}
          onChangeText={(value) => setUsuario({ ...usuario, email: value })}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={usuario.senha}
          onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonEntrar}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          style={styles.link}
        >
          <Text style={styles.butoomCadastre}>Cadastre-se</Text>
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
    padding: 20,
  },
  formContainer: {
    width: "100%",
   
    padding: 20,
    borderWidth: 2,
    borderColor: "#A80805",
    borderRadius: 10,
    backgroundColor: "#fd7c7c",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  buttonEntrar: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    alignItems: "center",
  },
  butoomCadastre: {
    color: "#A80805",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  bottomFooter: {
    width: "120%",
    padding: 10,
  },
  footer: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
  },
});
