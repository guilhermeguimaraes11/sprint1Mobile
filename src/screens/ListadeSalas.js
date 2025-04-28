import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Button } from 'react-native';

const salas = [
  { nome: 'Sala de Reuniões 1', descricao: 'Sala de reuniões equipada para conferências', bloco: 'A', tipo: 'Sala', capacidade: 20 },
  { nome: 'Laboratório de Informática', descricao: 'Laboratório com computadores e softwares de desenvolvimento', bloco: 'B', tipo: 'Laboratório', capacidade: 30 },
  { nome: 'Oficina Mecânica', descricao: 'Oficina com ferramentas para manutenção de veículos', bloco: 'C', tipo: 'Oficina', capacidade: 25 },
  { nome: 'Laboratório de Química', descricao: 'Laboratório de experimentos químicos', bloco: 'D', tipo: 'Laboratório', capacidade: 15 },
  { nome: 'Sala de Aula 101', descricao: 'Sala de aula equipada com projetor e quadro branco', bloco: 'E', tipo: 'Sala', capacidade: 40 },
  { nome: 'Auditório Principal', descricao: 'Auditório para eventos e palestras', bloco: 'F', tipo: 'Sala', capacidade: 100 },
  { nome: 'Sala de Estudos', descricao: 'Espaço silencioso para estudos individuais', bloco: 'G', tipo: 'Sala', capacidade: 12 },
  { nome: 'Laboratório de Física', descricao: 'Laboratório para experimentos de física', bloco: 'H', tipo: 'Laboratório', capacidade: 18 },
  { nome: 'Oficina de Marcenaria', descricao: 'Oficina equipada com ferramentas de marcenaria', bloco: 'I', tipo: 'Oficina', capacidade: 20 },
  { nome: 'Sala de Videoconferências', descricao: 'Sala equipada para videoconferências e apresentações remotas', bloco: 'J', tipo: 'Sala', capacidade: 10 },
  { nome: 'Sala de Treinamento', descricao: 'Sala de treinamento para cursos corporativos', bloco: 'K', tipo: 'Sala', capacidade: 25 },
  { nome: 'Laboratório de Biologia', descricao: 'Laboratório para experimentos biológicos', bloco: 'L', tipo: 'Laboratório', capacidade: 16 },
  { nome: 'Sala de Projetos', descricao: 'Sala equipada para reuniões de equipe e desenvolvimento de projetos', bloco: 'M', tipo: 'Sala', capacidade: 18 },
  { nome: 'Sala Multimídia', descricao: 'Sala equipada com recursos audiovisuais e multimídia', bloco: 'N', tipo: 'Sala', capacidade: 35 },
  { nome: 'Oficina de Costura', descricao: 'Oficina com máquinas e ferramentas para costura', bloco: 'O', tipo: 'Oficina', capacidade: 15 },
  { nome: 'Laboratório de Eletrônica', descricao: 'Laboratório para experimentos e montagem de circuitos eletrônicos', bloco: 'P', tipo: 'Laboratório', capacidade: 20 },
  { nome: 'Sala VIP', descricao: 'Sala exclusiva para reuniões de alto nível', bloco: 'Q', tipo: 'Sala', capacidade: 8 },
  { nome: 'Oficina de Soldagem', descricao: 'Oficina equipada com maquinário para soldagem', bloco: 'R', tipo: 'Oficina', capacidade: 12 },
  { nome: 'Laboratório de Culinária', descricao: 'Laboratório com equipamentos para aulas práticas de culinária', bloco: 'S', tipo: 'Laboratório', capacidade: 12 },
];

export default function ListaDeSalas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);

  const openModal = (item) => {
    setSelectedSala(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSala(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.row}>
        <Text style={styles.cell}>{item.nome}</Text>
        <Text style={styles.cell}>{item.descricao}</Text>
        <Text style={styles.cell}>{item.bloco}</Text>
        <Text style={styles.cell}>{item.tipo}</Text>
        <Text style={styles.cell}>{item.capacidade}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NOME</Text>
        <Text style={styles.headerText}>DESCRIÇÃO</Text>
        <Text style={styles.headerText}>BLOCO</Text>
        <Text style={styles.headerText}>TIPO</Text>
        <Text style={styles.headerText}>CAPACIDADE</Text>
      </View>

      <FlatList
        data={salas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por: Leonardo Pedroso, Guilherme Guimarães e Hyago</Text>
      </View>

      {/* Modal de Reserva */}
      {selectedSala && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reserva de Sala</Text>
              <Text>Nome: {selectedSala.nome}</Text>
              <Text>Descrição: {selectedSala.descricao}</Text>
              <Text>Bloco: {selectedSala.bloco}</Text>
              <Text>Tipo: {selectedSala.tipo}</Text>
              <Text>Capacidade: {selectedSala.capacidade}</Text>

              <TouchableOpacity style={styles.reserveButton} onPress={() => {
                alert('Reserva realizada com sucesso!');
                closeModal();
              }}>
                <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
                
              </TouchableOpacity>

              <Button title="Cancelar" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBEE',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFC2C2',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#000',
  },
  footer: {
    padding: 10,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reserveButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
