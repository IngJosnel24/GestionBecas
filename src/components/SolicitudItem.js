// src/components/SolicitudItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SolicitudItem = ({ solicitud }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beca: {solicitud.becaId}</Text>
      <Text style={styles.status}>Estado: {solicitud.estado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
});

export default SolicitudItem;
