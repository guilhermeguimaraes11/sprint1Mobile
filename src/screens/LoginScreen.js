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

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState({
    email: "",
    senha: "",
    showPassword: false, // Controla a visibilidade da senha
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
            secureTextEntry={usuario.showPassword} // Controla a visibilidade
            onChangeText={(value) => setUsuario({ ...usuario, senha: value })}
            style={styles.input}
          />
          {/* Icone para mostrar ou ocultar a senha dentro do campo */}
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
