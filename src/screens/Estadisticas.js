import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const Estadisticas = () => {
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['Universitaria', 'Deportiva', 'Cultural'],
    datasets: [
      {
        data: [10, 5, 2], // Cantidad de solicitudes por tipo
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes por Tipo de Beca</Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#6a11cb',
          backgroundGradientTo: '#2575fc',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  chart: { marginVertical: 8, borderRadius: 16 },
});

export default Estadisticas;
