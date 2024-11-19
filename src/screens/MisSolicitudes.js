import { View, Text, TextInput, Alert, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { appFirebase } from '../../db/firebaseconfig';
import { Picker } from '@react-native-picker/picker';

export default function MisSolicitudes() {
    const db = getFirestore(appFirebase);
    const [solicitantes, setSolicitantes] = useState({
        nombre: "",
        apellidos: "",
        cedula: "",
        sexo: "",
        carrera: "",
        beca: "",
        imagen: null,
    });
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);

    const establecerEstado = (campo, valor) => {
        setSolicitantes({ ...solicitantes, [campo]: valor });
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 3],
                quality: 1,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo seleccionar la imagen.");
        }
    };

    const validarDatos = () => {
        const nuevosErrores = {};
        let valido = true;

        if (!image) {
            Alert.alert("Imagen requerida", "Por favor, selecciona una imagen.");
            valido = false;
        }

        // Validar campos obligatorios
        if (!solicitantes.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio.";
            valido = false;
        }
        if (!solicitantes.apellidos.trim()) {
            nuevosErrores.apellidos = "Los apellidos son obligatorios.";
            valido = false;
        }
        if (!solicitantes.cedula.trim()) {
            nuevosErrores.cedula = "La cédula es obligatoria.";
            valido = false;
        }
        if (!solicitantes.sexo) {
            nuevosErrores.sexo = "El sexo es obligatorio.";
            valido = false;
        }
        if (!solicitantes.carrera) {
            nuevosErrores.carrera = "La carrera es obligatoria.";
            valido = false;
        }
        if (!solicitantes.beca) {
            nuevosErrores.beca = "El tipo de beca es obligatorio.";
            valido = false;
        }

        setErrors(nuevosErrores);

        if (valido) {
            guardarSolicitud({
                ...solicitantes,
                imagen: image,
            });
            resetFormulario();
        }
    };

    const guardarSolicitud = async (datos) => {
        try {
            const docRef = await addDoc(collection(db, "Solicitantes"), {
                ...datos,
                status: "Pendiente",
            });
            console.log("Documento añadido con ID:", docRef.id);
            Alert.alert("Éxito", "Solicitud registrada correctamente.");
        } catch (error) {
            console.error("Error al guardar la solicitud:", error);
            Alert.alert("Error", "No se pudo registrar la solicitud.");
        }
    };

    const resetFormulario = () => {
        setSolicitantes({
            nombre: "",
            apellidos: "",
            cedula: "",
            sexo: "",
            carrera: "",
            beca: "",
            imagen: null,
        });
        setImage(null);
        setErrors({});
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titulo}>Nueva solicitud</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese su nombre"
                    value={solicitantes.nombre}
                    onChangeText={(valor) => establecerEstado("nombre", valor)}
                />
                {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellidos:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese sus apellidos"
                    value={solicitantes.apellidos}
                    onChangeText={(valor) => establecerEstado("apellidos", valor)}
                />
                {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cédula:</Text>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingrese su cédula"
                    value={solicitantes.cedula}
                    onChangeText={(valor) => establecerEstado("cedula", valor)}
                />
                {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Sexo:</Text>
                <Picker
                    selectedValue={solicitantes.sexo}
                    onValueChange={(valor) => establecerEstado("sexo", valor)}
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
                <Picker
                    selectedValue={solicitantes.carrera}
                    onValueChange={(valor) => establecerEstado("carrera", valor)}
                    style={styles.TextInput}
                >
                    <Picker.Item label="Seleccione su carrera" value="" />
                    <Picker.Item label="Derecho" value="Derecho" />
                    <Picker.Item label="Psicología" value="Psicología" />
                    <Picker.Item label="Ingeniería Civil" value="Ingeniería Civil" />
                    <Picker.Item label="Ingeniería Informática" value="Ingeniería Informática" />
                    <Picker.Item label="Medicina" value="Medicina" />
                </Picker>
                {errors.carrera && <Text style={styles.errorText}>{errors.carrera}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipo de beca:</Text>
                <Picker
                    selectedValue={solicitantes.beca}
                    onValueChange={(valor) => establecerEstado("beca", valor)}
                    style={styles.TextInput}
                >
                    <Picker.Item label="Seleccione el tipo de beca" value="" />
                    <Picker.Item label="Académica" value="Académica" />
                    <Picker.Item label="Transporte" value="Transporte" />
                    <Picker.Item label="Interna" value="Interna" />
                </Picker>
                {errors.beca && <Text style={styles.errorText}>{errors.beca}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Seleccionar imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <TouchableOpacity style={styles.submitButton} onPress={validarDatos}>
                <Text style={styles.submitButtonText}>Registrar solicitud</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f7f7f7", 
        flexGrow: 1,
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: "#1a237e",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#4a4a4a",
        fontWeight: "bold",
    },
    TextInput: {
        borderColor: "#d32f2f", 
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff", 
        width: "100%",
    },
    errorText: {
        color: "#d32f2f", 
        marginTop: 4,
        fontSize: 14,
    },
    image: {
        width: 150,
        height: 150,
        marginVertical: 10,
        alignSelf: "center",
        borderRadius: 10,
        borderColor: "#ffeb3b", 
        borderWidth: 3,
    },
    button: {
        backgroundColor: "#1a237e", 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffff", 
        fontSize: 16,
        fontWeight: "bold",
    },
    submitButton: {
        backgroundColor: "#1a7e36",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#ffff", 
        fontSize: 18,
        fontWeight: "bold",
    },
    picker: {
        borderColor: "#d32f2f", 
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "#fff", 
        width: "100%",
    },
});


