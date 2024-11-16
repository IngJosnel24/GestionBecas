// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';

import ListaBecas from '../screens/ListaBeca';
import DetalleBeca from '../screens/DetalleBeca';
import FormularioSolicitud from '../screens/FormularioSolicitud';
import MisSolicitudes from '../screens/MisSolicitudes';
import Estadisticas from '../screens/Estadisticas';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListaBecas" component={ListaBecas} options={{ title: 'Becas Disponibles' }} />
      <Stack.Screen name="DetalleBeca" component={DetalleBeca} options={{ title: 'Detalles de la Beca' }} />
      <Stack.Screen name="FormularioSolicitud" component={FormularioSolicitud} options={{ title: 'Formulario de Solicitud' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Inicio"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Inicio') iconName = 'home';
            else if (route.name === 'MisSolicitudes') iconName = 'list';
            else if (route.name === 'Estadisticas') iconName = 'bar-chart';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Inicio" component={InicioStack} options={{ title: 'Inicio' }} />
        <Tab.Screen name="MisSolicitudes" component={MisSolicitudes} options={{ title: 'Mis Solicitudes' }} />
        <Tab.Screen name="Estadisticas" component={Estadisticas} options={{ title: 'Estadísticas' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
