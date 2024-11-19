import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


import Estadisticas from '../screens/Estadisticas';
import MisSolicitudes from '../screens/MisSolicitudes';

const Tab = createBottomTabNavigator();

function MyTabs() {
  
}

const Estadisticas_Screen = () => (
  <View style={styles.screenContainer}>
  
  </View>
);

const ListaBecas = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.titulo}>Listado de Becas</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar beca o estudiante..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarLabelStyle: { fontSize: 12, color: 'tomato' },
        }}
      >
        <Tab.Screen
          name="Inicio"
          component={ListaBecas}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Solicitudes"
          component={MisSolicitudes}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Estadísticas"
          component={Estadisticas}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    marginTop: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
