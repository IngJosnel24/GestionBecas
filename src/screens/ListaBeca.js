
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { appFirebase } from '../../db/firebaseconfig';

const ListaBecas = () => {
  const [searchText, setSearchText] = useState('');
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(appFirebase);

  const cargarBecas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Becas'));
      const becasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBecas(becasData);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar las becas:', error);
      Alert.alert('Error', 'No se pudieron cargar las becas.');
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBecas();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredBecas = becas.filter(beca => {
    const searchLower = searchText.toLowerCase();
    return (
      beca.nombre?.toLowerCase().includes(searchLower) ||
      beca.apellidos?.toLowerCase().includes(searchLower) ||
      beca.cedula?.toLowerCase().includes(searchLower) ||
      beca.beca?.toLowerCase().includes(searchLower) ||
      beca.carrera?.toLowerCase().includes(searchLower)
    );
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.imagen }} 
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.nombre} {item.apellidos}</Text>
        <Text style={styles.details}>Cédula: {item.cedula}</Text>
        <Text style={styles.details}>Sexo: {item.sexo}</Text>
        <Text style={styles.details}>Carrera: {item.carrera}</Text>
        <Text style={styles.details}>Beca: {item.beca}</Text>
        <Text style={styles.details}>Estado: {item.status}</Text>
        <Text style={styles.details}>Fecha de Aceptación: {item.fechaAceptacion?.toDate().toLocaleDateString()}</Text>
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
        <TouchableOpacity onPress={cargarBecas}>
          <Ionicons name="refresh" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando becas...</Text>
      ) : (
        <FlatList
          data={filteredBecas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={cargarBecas}
        />
      )}
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});

export default ListaBecas;
