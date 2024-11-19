import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListaBecas = ({ acceptedApplications }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.nombre} {item.apellidos}</Text>
        <Text style={styles.details}>Cédula: {item.cedula}</Text>
        <Text style={styles.details}>Sexo: {item.sexo}</Text>
        <Text style={styles.details}>Carrera: {item.carrera}</Text>
        <Text style={styles.details}>Beca: {item.beca}</Text>
        <Text style={styles.details}>Estado: Aceptada</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Listado de Becas</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar beca o estudiante..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={acceptedApplications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    marginTop: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});

export default ListaBecas;