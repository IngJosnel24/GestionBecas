import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


import Estadisticas from '../screens/Estadisticas';
import MisSolicitudes from '../screens/MisSolicitudes';
import ListadoSolicitudes from '../screens/Listadosolicitudes';
import ListaBecas from '../screens/ListaBeca';


const Tab = createBottomTabNavigator();

export default function App() {
  const [acceptedApplications, setAcceptedApplications] = useState([]);

  const handleAcceptApplication = (application) => {
    setAcceptedApplications([...acceptedApplications, application]);
  };

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
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        >
          {(props) => <ListaBecas {...props} acceptedApplications={acceptedApplications} />}
        </Tab.Screen>
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
          name="Listadosolicitudes"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu" size={size} color={color} />
            ),
          }}
        >
          {(props) => <ListadoSolicitudes {...props} onAcceptApplication={handleAcceptApplication} />}
        </Tab.Screen>
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
}
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

