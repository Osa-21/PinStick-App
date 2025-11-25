import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';

// Colores definidos según tu diseño
const COLORS = {
  purple: '#5c2d91', // Morado aproximado de tu imagen
  orange: '#ff9900', // Naranja aproximado
  bg: '#f5f5f5',     // Fondo gris claro
};

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
    // Temporizador de 3 segundos (3000 ms)
    const timer = setTimeout(() => {
      // Usamos 'replace' en lugar de 'navigate' para que el usuario
      // no pueda volver al Splash presionando 'atrás'.
        navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer); // Limpieza del timer si el componente se desmonta
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
            {/* Asegúrate de que tu logo esté en assets/logo.png */}
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.textPin}>Pin </Text>
                    <Text style={styles.textAmp}>&</Text>
                    <Text style={styles.textStick}> Stick</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textPin: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.purple,
    },
    textAmp: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.orange,
    },
    textStick: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.purple,
    },
});

export default SplashScreen;