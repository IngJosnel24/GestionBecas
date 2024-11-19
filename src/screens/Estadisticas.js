import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { jsPDF } from "jspdf";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const Estadisticas = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const simulatedData = [
      { carrera: "Ingeniería", estado: "aceptada" },
      { carrera: "Medicina", estado: "aceptada" },
      { carrera: "Ingeniería", estado: "aceptada" },
      { carrera: "Derecho", estado: "aceptada" },
      { carrera: "Ingeniería", estado: "aceptada" },
      { carrera: "Medicina", estado: "rechazada" },
    ];

    const carreraCount = {};
    simulatedData.forEach(({ carrera, estado }) => {
      if (estado === "aceptada") {
        carreraCount[carrera] = (carreraCount[carrera] || 0) + 1;
      }
    });

    const labels = Object.keys(carreraCount);
    const data = Object.values(carreraCount);

    setChartData({ labels, datasets: [{ data }] });
  }, []);

  const generateAndSharePDF = async () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Estadísticas de becas por carrera", 10, 10);

    chartData.labels.forEach((label, index) => {
      const count = chartData.datasets[0].data[index];
      doc.text(`${label}: ${count} becas aceptadas`, 10, 20 + index * 10);
    });

    const pdfBase64 = doc.output("datauristring").split(",")[1];
    const pdfUri = `${FileSystem.documentDirectory}EstadisticasBecas.pdf`;

    await FileSystem.writeAsStringAsync(pdfUri, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri);
    } else {
      alert("La funcionalidad para compartir no está disponible en este dispositivo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carreras con becas aceptadas</Text>
      {chartData.labels.length > 0 ? (
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#f2f2f2",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Azul suave para las barras
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Negro para las etiquetas
            barPercentage: 0.7,
          }}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.loading}>Cargando datos...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={generateAndSharePDF}>
        <Text style={styles.buttonText}>Generar y compartir PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e88e5", // Azul
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#1e88e5", // Azul más fuerte
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: "#fff", // Blanco para contraste
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Estadisticas;
