import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TelaDeReservasDoUsuario = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const id = await AsyncStorage.getItem('idUsuario');
        setUserId(id);
        if (id) {
          const response = await axios.get('/reservas/v1/reservaschedule');
          if (response.data) {
          setReservas(response.data);
           }
          
          
        }
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        // Exiba uma mensagem de erro para o usuário, se necessário
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []); // Executa apenas uma vez na montagem do componente (dependência vazia)

  const renderItem = ({ item }) => (
    <View style={styles.reservaItem}>
      <Text>Sala: {item.sala}</Text>
      <Text>Data: {item.data}</Text>
      <Text>Horário: {item.horario}</Text>
      {/* Adicione aqui botões para ver detalhes, cancelar, etc. */}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suas Reservas</Text>
      {reservas.length > 0 ? (
        <FlatList
          data={reservas}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text>Você não tem nenhuma reserva.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFDCDC',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  reservaItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default TelaDeReservasDoUsuario;