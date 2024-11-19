import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { appFirebase } from '../../db/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

export default function ListadoSolicitudes({ onAcceptApplication }) {
    const db = getFirestore(appFirebase);
    const [solicitantes, setSolicitantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const cargarSolicitudes = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'Solicitantes'));
            const solicitudes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSolicitantes(solicitudes);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar las solicitudes:', error);
            Alert.alert('Error', 'No se pudieron cargar las solicitudes.');
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarSolicitudes();
    }, []);

    const handleAccept = async (item) => {
        try {
            const docRef = doc(db, 'Solicitantes', item.id);
            await updateDoc(docRef, { status: 'Aceptada' });
            Alert.alert('Éxito', `La solicitud de ${item.nombre} ha sido aceptada.`);
            onAcceptApplication(item);
            setSolicitantes(solicitantes.filter(sol => sol.id !== item.id));
            navigation.navigate('Inicio');
        } catch (error) {
            console.error('Error al aceptar la solicitud:', error);
            Alert.alert('Error', 'No se pudo aceptar la solicitud.');
        }
    };

    const deleteSolicitud = async (id) => {
        try {
            await deleteDoc(doc(db, 'Solicitantes', id));
            setSolicitantes(prevSolicitantes => prevSolicitantes.filter(solicitante => solicitante.id !== id));
            Alert.alert("Éxito", "Solicitud eliminada con éxito");
        } catch (error) {
            console.error("Error al eliminar la solicitud: ", error);
            Alert.alert("Error", "Hubo un problema al eliminar la solicitud");
        }
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
                <Text style={styles.details}>Estado: {item.status || 'Pendiente'}</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAccept(item)}
                    >
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => deleteSolicitud(item.id)}
                    >
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Listado de Solicitudes</Text>
            {loading ? (
                <Text style={styles.loadingText}>Cargando...</Text>
            ) : (
                <FlatList
                    data={solicitantes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <TouchableOpacity style={styles.reloadButton} onPress={cargarSolicitudes}>
                <Text style={styles.reloadButtonText}>Recargar Solicitudes</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#777',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
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
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    acceptButton: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    reloadButton: {
        backgroundColor: '#705b14',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    reloadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});