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
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: '#4a148c', // Azul índigo oscuro
          tabBarInactiveTintColor: '#757575', // Gris medio
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
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d32f2f', // Rojo escarlata
    marginVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
    backgroundColor: '#e8eaf6', // Azul claro
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#4a148c', // Azul índigo oscuro
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  icon: {
    marginHorizontal: 8,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#9b9b9b', // Azul índigo oscuro
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ffd600', // Amarillo vibrante
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#1a237e', // Azul índigo oscuro
    fontSize: 16,
    fontWeight: 'bold',
  },
});

