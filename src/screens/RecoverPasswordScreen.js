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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8C00',
    bg: '#f5f5f5',
    textGray: '#666666',
    inputBg: '#FFFFFF',
};

const RecoverPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleRecover = () => {
        // Aquí iría la lógica real para enviar el correo de recuperación
        // Por ahora, solo mostraremos una alerta simulando el envío.
        if (email.trim() === '') {
        Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
        return;
        }
        Alert.alert(
        'Correo enviado',
        'Si el correo existe, recibirás instrucciones para recuperar tu contraseña.',
        [{ text: 'OK', onPress: () => navigation.goBack() }] // Vuelve al login al dar OK
        );
    };

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.purple} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
                />
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                </Text>
            </View>

            <View style={styles.formContainer}>
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

                <TouchableOpacity style={styles.sendButton} onPress={handleRecover}>
                <Text style={styles.sendButtonText}>Enviar Instrucciones</Text>
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
        top: 40,
        left: 20,
        zIndex: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 60,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.purple,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textGray,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        marginBottom: 25,
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
    sendButton: {
        backgroundColor: COLORS.orange, // Usamos naranja para acciones principales
        borderRadius: 10,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RecoverPasswordScreen;