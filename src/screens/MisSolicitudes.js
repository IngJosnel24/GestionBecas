import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { appFirebase } from '../../db/firebaseconfig';
import { Picker } from '@react-native-picker/picker';

export default function MisSolicitudes() {
    const db = getFirestore(appFirebase);
    const [Solicitantes, setSolicitantes] = useState({
        nombre: "",
        apellidos: "",
        cedula: "",
        sexo: "",
        carrera: "",
        beca: "",
        imagen: "https://example.com/default-image.png", // Imagen predeterminada
    });
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);

    const establecerEstado = (nombre, value) => {
        setSolicitantes({ ...Solicitantes, [nombre]: value });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const validarDatos = () => {
        let valid = true;
        let newErrors = {};
        if (!image) {
            Alert.alert('Imagen requerida', 'Por favor, selecciona una imagen para la solicitud.');
            return;
        }

        // Verificar que todos los campos estén llenos
        if (!Solicitantes.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
            valid = false;
        }
        if (!Solicitantes.apellidos.trim()) {
            newErrors.apellidos = 'Los apellidos son obligatorios';
            valid = false;
        }
        if (!Solicitantes.cedula.trim()) {
            newErrors.cedula = 'La cédula es obligatoria';
            valid = false;
        }
        if (!Solicitantes.sexo.trim()) {
            newErrors.sexo = 'El sexo es obligatorio';
            valid = false;
        }
        if (!Solicitantes.carrera.trim()) {
            newErrors.carrera = 'La carrera es obligatoria';
            valid = false;
        }
        if (!Solicitantes.beca.trim()) {
            newErrors.beca = 'El tipo de beca es obligatorio';
            valid = false;
        }

        setErrors(newErrors);
        if (valid) {
            guardarSolicitud({
                ...Solicitantes,
                imagen: image || Solicitantes.imagen,
            });
            setSolicitantes({
                nombre: "",
                apellidos: "",
                cedula: "",
                sexo: "",
                carrera: "",
                beca: "",
                imagen: "https://example.com/default-image.png",
            });
            setImage(null);
            Alert.alert('Éxito', 'Solicitud registrada correctamente');
            setErrors({});
        }
    };

    const guardarSolicitud = async (Solicitantes) => {
      try {
          const docRef = await addDoc(collection(db, "Solicitantes"), Solicitantes);
          console.log("Documento escrito con ID: ", docRef.id);
      } catch (e) {
          console.error("Error al añadir el documento: ", e);
      }
  };
  
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Nueva Solicitud</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese su nombre"
                    value={Solicitantes.nombre}
                    onChangeText={(value) => establecerEstado("nombre", value)}
                />
                {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellidos:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese sus apellidos"
                    value={Solicitantes.apellidos}
                    onChangeText={(value) => establecerEstado("apellidos", value)}
                />
                {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cédula:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese su cédula"
                    value={Solicitantes.cedula}
                    onChangeText={(value) => establecerEstado("cedula", value)}
                />
                {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Sexo:</Text>
                <Picker
                    selectedValue={Solicitantes.sexo}
                    onValueChange={(itemValue) => establecerEstado("sexo", itemValue)}
                    style={styles.TextInput}
                >
                    <Picker.Item label="Seleccione su sexo" value="" />
                    <Picker.Item label="Femenino" value="Femenino" />
                    <Picker.Item label="Masculino" value="Masculino" />
                </Picker>
                {errors.sexo && <Text style={styles.errorText}>{errors.sexo}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Carrera:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese su carrera"
                    value={Solicitantes.carrera}
                    onChangeText={(value) => establecerEstado("carrera", value)}
                />
                {errors.carrera && <Text style={styles.errorText}>{errors.carrera}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipo de Beca:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese el tipo de beca"
                    value={Solicitantes.beca}
                    onChangeText={(value) => establecerEstado("beca", value)}
                />
                {errors.beca && <Text style={styles.errorText}>{errors.beca}</Text>}
            </View>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity style={styles.submitButton} onPress={validarDatos}>
                <Text style={styles.submitButtonText}>Registrar Solicitud</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    TextInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        width: '100%',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#b59f5e',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: '#705b14',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
