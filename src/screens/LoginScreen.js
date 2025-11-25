import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,             // <-- Importante para mostrar errores
    ActivityIndicator  // <-- Importante para mostrar que está cargando
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Librería de iconos

// --- NUEVAS IMPORTACIONES DE FIREBASE ---
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8C00',
    bg: '#f5f5f5',
    textGray: '#666666',
    inputBg: '#FFFFFF',
};

const LoginScreen = ({ navigation }) => {
  // Usamos 'email' en lugar de 'user' para ser más claros con Firebase
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado para el spinner de carga 
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

        // --- NUEVA FUNCIÓN PARA MANEJAR EL LOGIN ---
    const handleLogin = async () => {
        if (email === '' || password === '') {
        Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
        return;
        }

        setLoading(true); // Mostramos el spinner

        try {
        // Intentamos iniciar sesión con Firebase
        await signInWithEmailAndPassword(auth, email, password);
        
        // SI TIENE ÉXITO:
        console.log('Login exitoso');
        // Usamos .replace() para que el usuario NO pueda volver al login con el botón atrás.
        // 'Main' es el nombre que le dimos al Tab Navigator en App.js
        navigation.replace('Main');

        } catch (error) {
        console.error('Error en login:', error);
        let errorMessage = 'Usuario o contraseña incorrectos.';
        // Puedes personalizar más mensajes según error.code si quieres
        if (error.code === 'auth/invalid-email') {
            errorMessage = 'El formato del correo no es válido.';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
        }
        Alert.alert('Error de Inicio de Sesión', errorMessage);
        } finally {
        setLoading(false); // Ocultamos el spinner pase lo que pase
        }
    };

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
                <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
                />
                <View style={styles.textContainer}>
                <Text style={styles.titlePin}>Pin </Text>
                <Text style={styles.titleAmp}>&</Text>
                <Text style={styles.titleStick}> Stick</Text>
                </View>
            </View>

            <View style={styles.formContainer}>
                {/* Input Correo (antes Usuario) */}
                <View style={styles.inputWrapper}>
                {/* Cambié el icono a 'mail' para que sea más claro */}
                <Ionicons name="mail" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address" // Teclado optimizado para emails
                    autoCapitalize="none"        // Importante para emails
                />
                </View>

                {/* --- INPUT DE CONTRASEÑA MODIFICADO --- */}
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        // Si isPasswordVisible es true, NO ocultamos el texto (secureTextEntry={false})
                        secureTextEntry={!isPasswordVisible}
                    />
                    {/* Botón del ojo para alternar visibilidad */}
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Ionicons 
                        name={isPasswordVisible ? "eye-off" : "eye"} 
                        size={20} 
                        color="#999" 
                        />
                    </TouchableOpacity>
                </View>
                {/* -------------------------------------- */}

                <TouchableOpacity 
                onPress={() => navigation.navigate('RecoverPassword')}
                style={styles.recoverContainer}
                >
                <Text style={styles.recoverText}>
                    ¿No recuerdas tu contraseña? <Text style={styles.recoverLink}>Recuperar.</Text>
                </Text>
                </TouchableOpacity>

                {/* Botón Entrar CON LÓGICA Y SPINNER */}
                <TouchableOpacity 
                style={[styles.loginButton, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
                >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text style={styles.loginButtonText}>Entrar</Text>
                )}
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
                style={styles.createAccountContainer}
                >
                <Text style={styles.createAccountText}>
                    ¿No tienes una cuenta? <Text style={styles.createAccountLink}>Crear una cuenta</Text>
                </Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    textContainer: {
        flexDirection: 'row',
    },
    titlePin: { fontSize: 24, fontWeight: 'bold', color: COLORS.purple },
    titleAmp: { fontSize: 24, fontWeight: 'bold', color: COLORS.orange },
    titleStick: { fontSize: 24, fontWeight: 'bold', color: COLORS.purple },

    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
        elevation: 2, // Sombra en Android
        shadowColor: '#000', // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#333',
    },
    recoverContainer: {
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    recoverText: {
        color: COLORS.textGray,
        fontSize: 12,
    },
    recoverLink: {
        color: COLORS.purple,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: COLORS.orange,
        borderRadius: 10,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    createAccountContainer: {
        alignItems: 'center',
    },
    createAccountText: {
        color: COLORS.textGray,
        fontSize: 13,
    },
    createAccountLink: {
        color: COLORS.purple,
        fontWeight: 'bold',
    },
});

export default LoginScreen;