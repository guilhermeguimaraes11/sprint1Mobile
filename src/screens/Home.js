import React from "react";
import { View, Text, StyleSheet } from "react-native";
import api from "../axios/axios"; // Importando a instância do axios

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.Msg}>Bem-vindo ao Home!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffdcdc",
  },
  Msg: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#A80805",
  },
});
