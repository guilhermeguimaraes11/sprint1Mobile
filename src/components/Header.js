import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title, onLogout }) {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate("Perfil"); // nome da rota de perfil
  };

  return (
    <View style={styles.header}>
      {onLogout ? (
        <TouchableOpacity onPress={goToProfile} style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={28} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {/* Botão de logout */}
      {onLogout ? (
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} /> // espaço vazio pra manter o layout alinhado
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 0,
    backgroundColor: "#D32F2F",
    paddingVertical: 20,
    width: "105%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#B71C1C",
    padding: 8,
    borderRadius: 5,
  },
  profileButton: {
    padding: 4,
  },
});
