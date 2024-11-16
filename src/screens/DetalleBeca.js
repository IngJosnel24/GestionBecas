// src/screens/DetalleBeca.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { db } from '../../db/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';

const DetalleBeca = ({ route, navigation }) => {
  const { becaId } = route.params;
  const [beca, setBeca] = useState(null);

  useEffect(() => {
    const fetchBeca = async () => {
      const becaDoc = await getDoc(doc(db, 'Becas', becaId));
      setBeca(becaDoc.data());
    };
    fetchBeca();
  }, [becaId]);

  if (!beca) return <Text>Cargando...</Text>;

  return (
    <View>
      <Text>{beca.nombre}</Text>
      <Text>{beca.descripcion}</Text>
      <Text>Monto: {beca.monto}</Text>
      <Button
        title="Aplicar"
        onPress={() => navigation.navigate('FormularioSolicitud', { becaId })}
      />
    </View>
  );
};

export default DetalleBeca;
