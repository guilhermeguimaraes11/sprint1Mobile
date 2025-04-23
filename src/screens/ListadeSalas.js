import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import axios from "axios";

export default function ListagemSalas() {
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    async function fetchSalas() {
      try {
        const response = await axios.get("http://10.89.240.80:5000/reservas/v1/salas/");
        setSalas(response.data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
      }
    }

    fetchSalas();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nome}</Text>
      <Text style={[styles.cell, { flex: 4 }]}>{item.descricao}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.bloco}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.tipo}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.capacidade}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Listagem das Salas</Text>

      <ScrollView horizontal>
        <View style={styles.tableWrapper}>
          <View style={styles.header}>
            <Text style={[styles.cell, styles.headerText, { flex: 2 }]}>NOME</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 4 }]}>DESCRIÇÃO</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>BLOCO</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>TIPO</Text>
            <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>CAP.</Text>
          </View>

          <FlatList
            data={salas}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido por: Leonardo Pedroso, Guilherme Guimarães e Hyago
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8dede",
    padding: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#A80805",
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: "#ccc",
    minWidth: 900,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#A80805",
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  rowEven: {
    backgroundColor: "#fdd2d2",
  },
  rowOdd: {
    backgroundColor: "#fdabab",
  },
  cell: {
    fontSize: 13,
    paddingHorizontal: 5,
  },
  footer: {
    marginTop: 10,
    backgroundColor: "#A80805",
    padding: 8,
    borderRadius: 8,
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontSize: 13,
  },
});
