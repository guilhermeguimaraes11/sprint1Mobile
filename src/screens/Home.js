import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Bem-vindo ao Home!</Text>
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
  welcomeMessage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A80805",
  },
});
