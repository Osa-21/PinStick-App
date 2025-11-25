import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
    FlatList,
    Platform,
    StatusBar as RNStatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8c00',
    bg: '#f5f5f5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
};

// Datos de ejemplo para Accesos Rápidos
const QUICK_ACTIONS = [
    {id: '1', name: 'Personalizado', icon: 'brush-outline' }, // Icono más artístico
    {id: '2', name: 'Localización', icon: 'map-outline' },    // Icono de mapa/marcador
    {id: '3', name: 'Pines', icon: 'ribbon-outline' },        // Icono representativo
    { id: '4', name: 'Stickers', icon: 'layers-outline' },
];

// Datos de ejemplo para Stickers (incluyendo la opción de "Crear")
const STICKERS_DATA = [
    { id: 'create', isCreateAction: true },
    { id: '1', name: 'Velociraptor', price: '$25', image: 'https://cdn-icons-png.flaticon.com/512/1998/1998749.png' },
    { id: '2', name: 'Caballero RPG', price: '$25', image: 'https://cdn-icons-png.flaticon.com/512/1037/1037979.png' },
];

// Datos de ejemplo para Pines
const PINS_DATA = [
    { id: '10', name: 'Cinnamoroll', price: '$140', image: 'https://i.pinimg.com/originals/fd/85/e8/fd85e8f1e2e43d6947a0b02ecab91c21.png' },
    { id: '11', name: 'Spiderman', price: '$140', image: 'https://cdn-icons-png.flaticon.com/512/1090/1090797.png' },
];

const HomeScreen = ({ navigation }) => {

    // Componente para renderizar cada Sticker/Pin
    const renderProductItem = ({ item }) => {
        if (item.isCreateAction) {
        return (
            <TouchableOpacity style={[styles.productCard, styles.createCard]}>
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3389/3389023.png' }} // Icono lápiz ejemplo
                style={styles.createIcon} 
            />
            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Crea Tu Diseño</Text>
            </TouchableOpacity>
            </TouchableOpacity>
        );
        }

        return (
        <View style={styles.productCard}>
            <View style={styles.priceTag}>
            <Text style={styles.priceText}>{item.price}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Agregar</Text>
            <Ionicons name="cart" size={14} color="white" style={{marginLeft: 4}} />
            </TouchableOpacity>
        </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
        {/* HEADER PERSONALIZADO */}
        <View style={styles.headerContainer}>
            <SafeAreaView>
            <View style={styles.headerContent}>
                {/* Logo */}
                <Image source={require('../../assets/logo.png')} style={styles.headerLogo} />
                
                {/* Barra de Búsqueda */}
                <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textLight} style={{marginRight: 8}} />
                <TextInput 
                    placeholder="Buscar pines, stickers..." 
                    placeholderTextColor={COLORS.textLight}
                    style={styles.searchInput}
                />
                </View>

                {/* Iconos derecha: Carrito y Perfil (NUEVO REQUERIMIENTO) */}
                <View style={styles.headerIcons}>
                <TouchableOpacity style={{marginRight: 15}}>
                    <Ionicons name="cart-outline" size={26} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                    <Ionicons name="person-circle-outline" size={28} color={COLORS.white} />
                </TouchableOpacity>
                </View>
            </View>
            </SafeAreaView>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            {/* BANNER DE OFERTA */}
            <LinearGradient
            colors={[COLORS.purple, COLORS.orange]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bannerContainer}
            >
            <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>¡OFERTA RELÁMPAGO!</Text>
                <Text style={styles.bannerSubtitle}>3x2 en todos los{"\n"}Stickers Personalizados</Text>
                <Text style={styles.bannerLegal}>Válido solo por 24 horas</Text>
                <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Ver Oferta</Text>
                </TouchableOpacity>
            </View>
            {/* Imagen decorativa del banner (opcional) */}
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4578/4578563.png' }} 
                style={styles.bannerImage} 
                resizeMode="contain"
            />
            </LinearGradient>

            {/* ACCESOS RÁPIDOS */}
            <View style={styles.quickActionsContainer}>
            {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity key={action.id} style={styles.actionItem}>
                <View style={styles.actionIconCircle}>
                    <Ionicons name={action.icon} size={28} color={COLORS.purple} />
                </View>
                <Text style={styles.actionText}>{action.name}</Text>
                </TouchableOpacity>
            ))}
            </View>

            {/* SECCIÓN STICKERS */}
            <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Stickers</Text>
            <FlatList
                data={STICKERS_DATA}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderProductItem}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
            </View>

            {/* SECCIÓN PINES */}
            <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pines</Text>
            <FlatList
                data={PINS_DATA}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderProductItem}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            />
            </View>

            {/* Espacio extra al final para que no se tape con el tab bar */}
            <View style={{ height: 80 }} />

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
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 0, // Ajuste para Android
        paddingBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    headerLogo: {
        width: 40,
        height: 40,
        borderRadius: 20, // Si el logo es cuadrado, esto lo hace redondo
        backgroundColor: 'white', // Fondo blanco por si el logo tiene transparencia
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 40,
        marginHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textDark,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // --- SCROLL CONTENT ---
    scrollContainer: {
        flex: 1,
    },
    // --- BANNER ---
    bannerContainer: {
        margin: 20,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 160,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    bannerSubtitle: {
        color: '#FFD699', // Un naranja muy claro para contraste
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    bannerLegal: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        marginBottom: 15,
    },
    bannerButton: {
        backgroundColor: COLORS.orange,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    bannerImage: {
        width: 100,
        height: 100,
        opacity: 0.9,
    },
    // --- QUICK ACTIONS ---
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginBottom: 25,
    },
    actionItem: {
        alignItems: 'center',
    },
    actionIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.purple,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: COLORS.white,
    },
    actionText: {
        color: COLORS.purple,
        fontSize: 12,
        fontWeight: '600',
    },
    // --- SECTIONS ---
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: COLORS.purple,
        marginLeft: 20,
        marginBottom: 15,
    },
    // --- PRODUCT CARD ---
    productCard: {
        backgroundColor: COLORS.white,
        width: 150,
        height: 200,
        borderRadius: 15,
        padding: 10,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        // Sombras
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    createCard: {
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.orange,
        borderStyle: 'dashed', // Borde punteado para "crear"
    },
    priceTag: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: COLORS.textLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        zIndex: 1,
    },
    priceText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    productImage: {
        width: 100,
        height: 100,
        marginTop: 20,
    },
    productName: {
        fontWeight: '600',
        color: COLORS.purple,
        marginBottom: 5,
    },
    addButton: {
        backgroundColor: COLORS.orange,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        width: '100%',
        justifyContent: 'center',
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    createIcon: {
        width: 60,
        height: 60,
        tintColor: COLORS.orange,
        marginBottom: 20,
    },
    createButton: {
        backgroundColor: COLORS.orange,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    createButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
});

export default HomeScreen;