import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { jsPDF } from "jspdf";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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

  const generateAndSharePDF = async () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text("Estadísticas de Becas por Carrera", 10, 10);

    // Agregar datos de las carreras al PDF
    chartData.labels.forEach((label, index) => {
      const count = chartData.datasets[0].data[index];
      doc.text(`${label}: ${count} becas aceptadas`, 10, 20 + index * 10);
    });

    // Generar el archivo PDF como Base64
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    // Guardar el archivo en el sistema de archivos
    const pdfUri = `${FileSystem.documentDirectory}EstadisticasBecas.pdf`;
    await FileSystem.writeAsStringAsync(pdfUri, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Compartir el archivo PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri);
    } else {
      alert("La funcionalidad para compartir no está disponible en este dispositivo.");
    }
  };

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

      <Button title="Generar y Compartir PDF" onPress={generateAndSharePDF} />
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
