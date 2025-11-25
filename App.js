import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Importamos todas nuestras pantallas
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecoverPasswordScreen from './src/screens/RecoverPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
// --- IMPORTANTE: Asegúrate de que esta línea esté aquí ---
import ProfileScreen from './src/screens/ProfileScreen';
// --------------------------------------------------------
import ExploreScreen from './src/screens/ExploreScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import { CartProvider } from './src/context/CartContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8C00',
    bg: '#f5f5f5',
};

// Componente Placeholder temporal
const PlaceholderScreen = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
        <Text style={{ color: COLORS.purple, fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
    </View>
);

// Navegador de Pestañas
function MainTabNavigator() {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: COLORS.orange,
            tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
            tabBarStyle: {
            backgroundColor: COLORS.purple,
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 15,
            paddingTop: 8,
            },
            tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Inicio') {
                iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Explorar') {
                iconName = focused ? 'compass' : 'compass-outline';
            } else if (route.name === 'Cupones') {
                iconName = focused ? 'ticket' : 'ticket-outline';
            } else if (route.name === 'Pedidos') {
                iconName = focused ? 'bag-handle' : 'bag-handle-outline';
            } else if (route.name === 'Perfil') {
                iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionicons name={iconName} size={24} color={color} />;
            },
        })}
        >
        
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Explorar" component={ExploreScreen} />
        <Tab.Screen name="Cupones" children={() => <PlaceholderScreen name="Ofertas" />} />
        <Tab.Screen name="Pedidos" children={() => <PlaceholderScreen name="Mis Pedidos" />} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
    }

    // App Principal
    export default function App() {
    return (
        <CartProvider>
            <NavigationContainer>
                <StatusBar style="dark" /> 
                <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />

                    <Stack.Screen name="Main" component={MainTabNavigator} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />

                    <Stack.Screen name="Cart" component={CartScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </CartProvider>
        
    );
}