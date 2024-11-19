import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const Estadisticas = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Datos simulados de carreras con becas aceptadas
    const simulatedData = [
      { carrera: 'Ingeniería', estado: 'aceptada' },
      { carrera: 'Medicina', estado: 'aceptada' },
      { carrera: 'Ingeniería', estado: 'aceptada' },
      { carrera: 'Derecho', estado: 'aceptada' },
      { carrera: 'Ingeniería', estado: 'aceptada' },
      { carrera: 'Medicina', estado: 'rechazada' }, // No se considera porque no está aceptada
    ];

    // Contar las becas aceptadas por carrera
    const carreraCount = {};
    simulatedData.forEach(({ carrera, estado }) => {
      if (estado === 'aceptada') {
        carreraCount[carrera] = (carreraCount[carrera] || 0) + 1;
      }
    });

    // Transformar los datos para el gráfico
    const labels = Object.keys(carreraCount);
    const data = Object.values(carreraCount);

    setChartData({ labels, datasets: [{ data }] });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carreras con Becas Aceptadas</Text>
      {chartData.labels.length > 0 ? (
        <BarChart
          data={chartData}
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
      ) : (
        <Text style={styles.loading}>Cargando datos...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  chart: { marginVertical: 8, borderRadius: 16 },
  loading: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555' },
});

export default Estadisticas;
