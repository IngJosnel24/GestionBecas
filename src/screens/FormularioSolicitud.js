// src/screens/FormularioSolicitud.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../../db/firebaseconfig';
import { addDoc, collection } from 'firebase/firestore';

const FormularioSolicitud = ({ route, navigation }) => {
  const { becaId, becaNombre } = route.params; // Datos de la beca seleccionada
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documento, setDocumento] = useState(''); // Campo adicional para subir un documento

  const enviarSolicitud = async () => {
    if (!nombre || !correo || !telefono || !documento) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'Solicitantes'), {
        becaId,
        becaNombre,
        nombre,
        correo,
        telefono,
        documento, // Nuevo campo
        estado: 'Pendiente',
        fechaEnvio: new Date(),
      });
      Alert.alert('Éxito', 'Tu solicitud ha sido enviada.');
      navigation.navigate('MisSolicitudes');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      Alert.alert('Error', 'Hubo un problema al enviar tu solicitud.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Solicitud</Text>
      <Text>Beca: {becaNombre}</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Tu correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Tu número de teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Adjunta un enlace al documento"
        value={documento}
        onChangeText={setDocumento}
      />
      <Button title="Enviar Solicitud" onPress={enviarSolicitud} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default FormularioSolicitud;
