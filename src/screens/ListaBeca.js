import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { appFirebase } from '../../db/firebaseconfig';

const ListaBecas = () => {
  const [searchText, setSearchText] = useState('');
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const db = getFirestore(appFirebase);

  const cargarBecas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Becas'));
      const becasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
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

  const toggleExpandCard = (id, data) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
    setEditableData(data); // Cargar los datos existentes para editar
  };

  const handleFieldChange = (field, value) => {
    setEditableData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const docRef = doc(db, 'Becas', id);
      await updateDoc(docRef, editableData);
      Alert.alert('Éxito', 'Información actualizada correctamente.');
      cargarBecas();
      setExpandedCardId(null); // Colapsar tarjeta después de actualizar
    } catch (error) {
      console.error('Error al actualizar la beca:', error);
      Alert.alert('Error', 'No se pudo actualizar la información.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, 'Becas', id);
      await deleteDoc(docRef);
      Alert.alert('Éxito', 'Beca eliminada correctamente.');
      cargarBecas();
    } catch (error) {
      console.error('Error al eliminar la beca:', error);
      Alert.alert('Error', 'No se pudo eliminar la beca.');
    }
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

  const renderItem = ({ item }) => {
    const isExpanded = item.id === expandedCardId;

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggleExpandCard(item.id, item)}>
          <Image source={{ uri: item.imagen }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.nombre} {item.apellidos}</Text>
            <Text style={styles.details}>Cédula: {item.cedula}</Text>
            <Text style={styles.details}>Carrera: {item.carrera}</Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.expandedContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editableData.nombre}
              onChangeText={(text) => handleFieldChange('nombre', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={editableData.apellidos}
              onChangeText={(text) => handleFieldChange('apellidos', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Cédula"
              value={editableData.cedula}
              onChangeText={(text) => handleFieldChange('cedula', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Carrera"
              value={editableData.carrera}
              onChangeText={(text) => handleFieldChange('carrera', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Beca"
              value={editableData.beca}
              onChangeText={(text) => handleFieldChange('beca', text)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleUpdate(item.id)}
            >
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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
    backgroundColor: '#f8f9fa',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1a237e', // Azul índigo fuerte
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#e8eaf6', // Azul índigo muy claro
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#212121',
  },
  icon: {
    color: '#5c6bc0', // Azul índigo intermedio
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#c62828', // Rojo escarlata
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#ffeb3b', // Amarillo vibrante
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
  },
  details: {
    fontSize: 14,
    color: '#424242',
    marginVertical: 2,
  },
  expandedContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cfd8dc', // Gris claro
    paddingTop: 10,
    backgroundColor: '#eceff1', // Fondo gris muy claro
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b0bec5', // Gris azulado
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1565c0', // Azul brillante
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#d32f2f', // Rojo intenso
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#757575', // Gris medio
  },
});

export default ListaBecas;

