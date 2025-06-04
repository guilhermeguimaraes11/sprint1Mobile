import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DisponibilidadeModal({ 
  visible, 
  onClose, 
  onConfirm
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPressOut={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Consultar disponibilidade</Text>

          <Text>Data Início:</Text>
          <TouchableOpacity 
            onPress={() => setStartPickerVisible(true)} 
            style={styles.dateInput}
          >
            <Text>{formatDate(startDate)}</Text>
          </TouchableOpacity>

          <Text>Data Fim:</Text>
          <TouchableOpacity 
            onPress={() => setEndPickerVisible(true)} 
            style={styles.dateInput}
          >
            <Text>{formatDate(endDate)}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="datetime"
            onConfirm={(date) => {
              setStartDate(date);
              setStartPickerVisible(false);
            }}
            onCancel={() => setStartPickerVisible(false)}
          />

          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="datetime"
            onConfirm={(date) => {
              setEndDate(date);
              setEndPickerVisible(false);
            }}
            onCancel={() => setEndPickerVisible(false)}
          />

          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {
              onConfirm(startDate, endDate);
            }}
          >
            <Text style={styles.confirmButtonText}>Verificar Disponibilidade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.confirmButton, { backgroundColor: "#888", marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.confirmButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  confirmButton: {
    backgroundColor: "#D32F2F",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  confirmButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
