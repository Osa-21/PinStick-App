import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    StatusBar as RNStatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Importamos Firebase Auth para obtener datos del usuario y cerrar sesión
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF9900',
    bg: '#f5f5f5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
    danger: '#FF3B30', // Color rojo para salir
};

const ProfileScreen = ({ navigation }) => {
  // Obtenemos el usuario actual de Firebase
    const user = auth.currentUser;
    // Si el usuario tiene nombre (displayName), lo usamos; si no, ponemos 'Usuario'
    const displayName = user?.displayName || 'Usuario de Pin&Stick';
    const email = user?.email || 'correo@ejemplo.com';

    // Función para manejar el cierre de sesión
    const handleSignOut = async () => {
        Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro de que quieres salir?",
        [
            { text: "Cancelar", style: "cancel" },
            {
            text: "Salir",
            style: "destructive",
            onPress: async () => {
                try {
                await signOut(auth);
                // Navegamos de vuelta al Stack de Login, reemplazando el historial
                // para que no pueda volver atrás.
                navigation.getParent()?.replace('Login');
                } catch (error) {
                console.error("Error al cerrar sesión:", error);
                Alert.alert("Error", "No se pudo cerrar la sesión.");
                }
            }
            }
        ]
        );
    };

    // Componente para un elemento de la lista de configuración
    const MenuItem = ({ icon, text, isLast, isDanger, onPress }) => (
        <TouchableOpacity 
        style={[styles.menuItem, isLast && styles.menuItemLast]} 
        onPress={onPress}
        >
        <View style={styles.menuItemLeft}>
            <Ionicons 
            name={icon} 
            size={22} 
            color={isDanger ? COLORS.danger : COLORS.purple} 
            style={{ marginRight: 15 }}
            />
            <Text style={[styles.menuItemText, isDanger && { color: COLORS.danger }]}>
            {text}
            </Text>
        </View>
        {!isDanger && <Ionicons name="chevron-forward" size={20} color="#CCC" />}
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
        {/* 1. CABECERA Y DATOS PRINCIPALES */}
        <View style={styles.headerContainer}>
            <SafeAreaView>
            <View style={styles.headerTopRow}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                {/* Botón de Configuración (Engranaje) */}
                <TouchableOpacity>
                <Ionicons name="settings-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.profileInfoContainer}>
                {/* Avatar: Usamos un icono genérico si no hay foto */}
                <View style={styles.avatarContainer}>
                <Ionicons name="person" size={50} color={COLORS.purple} />
                </View>
                <View style={styles.userInfo}>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userEmail}>{email}</Text>
                </View>
            </View>
            </SafeAreaView>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            {/* 2. ACCIONES RÁPIDAS (DASHBOARD) */}
            <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
            <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
                <Ionicons name="time-outline" size={30} color={COLORS.orange} />
                <Text style={styles.quickActionText}>Historial de Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
                <Ionicons name="color-palette-outline" size={30} color={COLORS.purple} />
                <Text style={styles.quickActionText}>Mis Diseños</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
                <Ionicons name="ticket-outline" size={30} color={COLORS.orange} />
                <Text style={styles.quickActionText}>Mis Cupones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
                <Ionicons name="heart-outline" size={30} color={COLORS.purple} />
                <Text style={styles.quickActionText}>Favoritos</Text>
            </TouchableOpacity>
            </View>

            {/* 3. INFORMACIÓN DE CUENTA */}
            <Text style={styles.sectionTitle}>Mi Cuenta</Text>
            <View style={styles.menuContainer}>
            <MenuItem icon="person-outline" text="Datos Personales" />
            <MenuItem icon="location-outline" text="Direcciones de Envío" />
            <MenuItem icon="card-outline" text="Métodos de Pago" isLast />
            </View>

            {/* 4. SOPORTE Y LEGAL */}
            <Text style={styles.sectionTitle}>Soporte</Text>
            <View style={styles.menuContainer}>
            <MenuItem icon="help-circle-outline" text="Ayuda y FAQ" />
            <MenuItem icon="chatbubble-ellipses-outline" text="Contáctanos" />
            <MenuItem icon="document-text-outline" text="Términos y Privacidad" isLast />
            </View>

            {/* 5. SALIR DE LA CUENTA */}
            <View style={[styles.menuContainer, { marginTop: 25, marginBottom: 40 }]}>
            <MenuItem 
                icon="log-out-outline" 
                text="Cerrar Sesión" 
                isLast 
                isDanger 
                onPress={handleSignOut}
            />
            </View>

        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    // --- HEADER ---
    headerContainer: {
        backgroundColor: COLORS.purple,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 10,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)', // Borde semitransparente bonito
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    // --- CONTENT ---
    scrollContainer: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 15,
        marginTop: 10,
    },
    // --- QUICK ACTIONS ---
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    quickActionCard: {
        backgroundColor: COLORS.white,
        width: '48%', // Casi la mitad para que quepan 2 por fila
        paddingVertical: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
        // Sombras suaves
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    quickActionText: {
        color: COLORS.textDark,
        marginTop: 10,
        fontWeight: '600',
        fontSize: 14,
    },
    // --- MENU ITEMS ---
    menuContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        paddingHorizontal: 5, // Un poco de padding lateral interno
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemLast: {
        borderBottomWidth: 0, // El último item no lleva línea divisoria
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: COLORS.textDark,
    },
});

export default ProfileScreen;