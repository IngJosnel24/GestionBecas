import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const MisSolicitudes = () => {
  // Datos de prueba
  const solicitudes = [
    { id: '1', beca: 'Beca Universitaria', estado: 'Aprobada' },
    { id: '2', beca: 'Beca Deportiva', estado: 'Pendiente' },
  ];

  const renderSolicitud = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.beca}</Text>
      <Text>Estado: {item.estado}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id}
        renderItem={renderSolicitud}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  card: { backgroundColor: '#fff', padding: 16, marginBottom: 10, borderRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
});

export default MisSolicitudes;
