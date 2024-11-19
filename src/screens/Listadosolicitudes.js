import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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
            
            const becaData = {
                nombre: item.nombre,
                apellidos: item.apellidos,
                cedula: item.cedula,
                sexo: item.sexo,
                carrera: item.carrera,
                beca: item.beca,
                imagen: item.imagen,
                fechaAceptacion: new Date(),
                status: 'Aceptada'
            };
    
            // Primero agregamos a Becas
            await addDoc(collection(db, 'Becas'), becaData);
            
            // Luego eliminamos de Solicitantes
            await deleteDoc(docRef);
            
            // Actualizamos el estado local para remover la solicitud
            setSolicitantes(prevSolicitantes => 
                prevSolicitantes.filter(sol => sol.id !== item.id)
            );
    
            Alert.alert(
                'Éxito', 
                `La solicitud de ${item.nombre} ha sido aceptada.`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (onAcceptApplication) {
                                onAcceptApplication(item);
                            }
                            // Intentar diferentes nombres de ruta comunes
                            try {
                                navigation.navigate('ListaBecas');
                            } catch (e) {
                                try {
                                    navigation.navigate('ListadoBecas');
                                } catch (e) {
                                    try {
                                        navigation.navigate('Becas');
                                    } catch (e) {
                                        console.warn('No se pudo navegar automáticamente');
                                    }
                                }
                            }
                        }
                    }
                ]
            );
            
        } catch (error) {
            console.error('Error al aceptar la solicitud:', error);
            Alert.alert('Error', 'No se pudo aceptar la solicitud.');
        }
    };

    const deleteSolicitud = async (id) => {
        try {
            await deleteDoc(doc(db, 'Solicitantes', id));
            setSolicitantes(prevSolicitantes => 
                prevSolicitantes.filter(solicitante => solicitante.id !== id)
            );
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
        backgroundColor: '#f5f5f5', // Gris claro para fondo general
        padding: 15,
    },
    titulo: {
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1a237e', // Azul índigo
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#757575', // Gris medio
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff', // Blanco para contraste
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#1a237e', // Azul índigo para el borde
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 5,
        color: '#1a237e', // Azul índigo
    },
    details: {
        fontSize: 14,
        color: '#616161', // Gris oscuro para detalles
        marginBottom: 3,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    acceptButton: {
        backgroundColor: '#c62828', // Rojo escarlata
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    rejectButton: {
        backgroundColor: '#ff8f00', // Amarillo oscuro
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff', // Blanco para texto
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    reloadButton: {
        backgroundColor: '#1a237e', // Azul índigo
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    reloadButtonText: {
        color: '#fff', // Blanco para texto
        fontSize: 16,
        fontWeight: 'bold',
    },
});


