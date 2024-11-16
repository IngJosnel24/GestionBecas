import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ListaBecas = () => {
  // Datos de prueba
  const becas = [
    { id: '1', nombre: 'Beca Universitaria', descripcion: 'Beca completa para estudios universitarios.' },
    { id: '2', nombre: 'Beca Deportiva', descripcion: 'Beca parcial para estudiantes destacados en deportes.' },
  ];

  const renderBeca = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nombre}</Text>
      <Text>{item.descripcion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={becas}
        keyExtractor={(item) => item.id}
        renderItem={renderBeca}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 10, borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
});

export default ListaBecas;
