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
    Alert, // Importamos Alert para mostrar errores o éxito
    ActivityIndicator // Para mostrar spinner de carga
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- IMPORTACIONES NUEVAS DE FIREBASE ---
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';

// Reutilizamos los mismos colores para consistencia
const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8C00',
    bg: '#f5f5f5',
    textGray: '#666666',
    inputBg: '#FFFFFF',
};

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado para mostrar carga
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

      // Función para manejar el registro
    const handleRegister = async () => {
        // 1. Validaciones básicas
        if (fullName === '' || email === '' || password === '' || confirmPassword === '') {
        Alert.alert('Error', 'Por favor completa todos los campos.');
        return;
        }
        if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
        }
        if (password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
        return;
        }

        setLoading(true); // Activar spinner

        try {
        // 2. Crear usuario en Firebase
        // Usamos la función importada aquí:
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 3. (Opcional) Actualizar el perfil con el nombre completo
        await updateProfile(user, {
            displayName: fullName,
        });

        console.log('Usuario registrado:', user.uid);
        Alert.alert(
            '¡Registro Exitoso!',
            'Tu cuenta ha sido creada correctamente.',
            [
            {
                text: 'Ir al Login',
                onPress: () => navigation.navigate('Login') // Redirigir al Login tras éxito
            }
            ]
        );

        } catch (error) {
        console.error('Error en registro:', error);
        let errorMessage = 'Ocurrió un error al registrarse.';
        // Personalizar mensajes de error comunes de Firebase
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este correo electrónico ya está registrado.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico no es válido.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña es muy débil.';
        }
        Alert.alert('Error de Registro', errorMessage);
        } finally {
        setLoading(false); // Desactivar spinner siempre
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Botón para volver atrás */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.purple} />
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        {/* Logo un poco más pequeño para dar espacio al formulario más largo */}
                        <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                        />
                        <Text style={styles.title}>Crear Cuenta</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Input Nombre Completo */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre Completo"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        {/* Input Correo Electrónico */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo Electrónico"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* --- INPUT DE CONTRASEÑA MODIFICADO --- */}
                        <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            // Usamos el estado para controlar la visibilidad
                            secureTextEntry={!isPasswordVisible}
                        />
                        {/* Botón del ojo */}
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Ionicons 
                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color="#999" 
                            />
                        </TouchableOpacity>
                        </View>

                        {/* Input Confirmar Contraseña */}
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar Contraseña"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Botón Registrarse CON LÓGICA Y SPINNER */}
                        <TouchableOpacity 
                            style={[styles.registerButton, loading && { opacity: 0.7 }]} // Cambiar estilo si carga
                            onPress={handleRegister}
                            disabled={loading} // Deshabilitar mientras carga
                            >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.registerButtonText}>Registrarse</Text>
                            )}
                        </TouchableOpacity>

                        {/* Ya tengo cuenta */}
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLinkContainer}>
                            <Text style={styles.loginLinkText}>
                                ¿Ya tienes una cuenta? <Text style={styles.loginLink}>Inicia Sesión</Text>
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
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40, // Ajusta según el SafeAreaView si es necesario
        left: 20,
        zIndex: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 60, // Espacio para el botón de atrás
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.purple,
    },
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
        elevation: 2,
        shadowColor: '#000',
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
    registerButton: {
        backgroundColor: COLORS.purple, // Usamos morado para diferenciar del Login
        borderRadius: 10,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        elevation: 3,
        shadowColor: COLORS.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        alignItems: 'center',
    },
    loginLinkText: {
        color: COLORS.textGray,
        fontSize: 13,
    },
    loginLink: {
        color: COLORS.orange,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;