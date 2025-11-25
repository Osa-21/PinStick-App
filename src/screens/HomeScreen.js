import React, { useState, useCallback } from 'react';
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
    StatusBar as RNStatusBar,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// Importamos useFocusEffect para recargar al entrar a la pantalla
import { useFocusEffect } from '@react-navigation/native';

// --- IMPORTACIONES DE FIREBASE ---
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

// 1. IMPORTAMOS EL HOOK DEL CARRITO
import { useCart } from '../context/CartContext';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF9900',
    bg: '#f5f5f5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
};

// Datos estáticos solo para los botones rápidos (no cambian)
const QUICK_ACTIONS = [
    { id: '1', name: 'Personalizado', icon: 'brush-outline' },
    { id: '2', name: 'Localización', icon: 'map-outline' },
    { id: '3', name: 'Pines', icon: 'ribbon-outline' },
    { id: '4', name: 'Stickers', icon: 'layers-outline' },
];

const HomeScreen = ({ navigation }) => {
  // Estados para guardar los datos reales de Firebase
    const [stickers, setStickers] = useState([]);
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cartCount } = useCart();


    // Función para mezclar un array (Algoritmo Fisher-Yates)
    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        // Mientras queden elementos a mezclar...
        while (currentIndex !== 0) {
        // Elegir un elemento restante...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // E intercambiarlo con el elemento actual.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // --- FUNCIÓN PARA TRAER DATOS DE FIREBASE ---
    const fetchData = async () => {
        try {
        //console.log("📡 Conectando a Firebase Project ID:", db.app.options.projectId); // <--- AGREGA ESTO
        setLoading(true);
        const productsRef = collection(db, 'products');

        // 1. Traer Stickers
        const stickersQuery = query(productsRef, where('category', '==', 'stickers'));
        const stickersSnapshot = await getDocs(stickersQuery);
        let stickersList = stickersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Mezclar y limitar a 10
        stickersList = shuffleArray(stickersList).slice(0, 10);

        // Agregamos el item especial "Crea tu diseño" al principio
        const stickersWithCreateOption = [{ id: 'create_sticker', isCreateAction: true }, ...stickersList];
        setStickers(stickersWithCreateOption);

        // 2. Traer Pines
        const pinsQuery = query(productsRef, where('category', '==', 'pines')); // O 'pines'
        const pinsSnapshot = await getDocs(pinsQuery);
        let pinsList = pinsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Mezclar y limitar a 10
        pinsList = shuffleArray(pinsList).slice(0, 10);

        // Agregamos el item especial "Crea tu diseño" TAMBIÉN AQUÍ
        const pinsWithCreateOption = [{ id: 'create_pin', isCreateAction: true }, ...pinsList];
        setPins(pinsWithCreateOption);

        } catch (error) {
        console.error("Error al cargar home:", error);
        } finally {
        setLoading(false);
        }
    };

    // Usamos useFocusEffect en lugar de useEffect para que se ejecute cada vez que "enfocamos" la pantalla
    useFocusEffect(
        useCallback(() => {
        fetchData();
        }, [])
    );
    // --------------------------------------------

    const renderProductItem = ({ item }) => {
        // Tarjeta Especial "Crea Tu Diseño"
        if (item.isCreateAction) {
        return (
            <TouchableOpacity style={[styles.productCard, styles.createCard]}>
            <Image 
                // Usamos un icono diferente si es Pin o Sticker si quisieras, por ahora el mismo lápiz
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3389/3389023.png' }} 
                style={styles.createIcon} 
            />
            <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Crea Tu Diseño</Text>
            </TouchableOpacity>
            </TouchableOpacity>
        );
        }

        // Tarjeta de Producto Normal (CONECTADA A DETALLE)
        return (
        <TouchableOpacity 
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })} 
        >
            <View style={styles.priceTag}>
            <Text style={styles.priceText}>${item.price}</Text>
            </View>
            <Image 
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
            style={styles.productImage} 
            resizeMode="contain" 
            />
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Agregar</Text>
            <Ionicons name="cart" size={14} color="white" style={{marginLeft: 4}} />
            </TouchableOpacity>
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.mainContainer}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
            <SafeAreaView>
            <View style={styles.headerContent}>
                <Image source={require('../../assets/logo.png')} style={styles.headerLogo} />
                <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.textLight} style={{marginRight: 8}} />
                <TextInput 
                    placeholder="Buscar pines, stickers..." 
                    placeholderTextColor={COLORS.textLight}
                    style={styles.searchInput}
                />
                </View>
                <View style={styles.headerIcons}>
                <TouchableOpacity 
                    style={{marginRight: 15}}
                    onPress={() => navigation.navigate('Cart')}
                >
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
            
            {/* BANNER */}
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

            {/* --- SECCIONES DINÁMICAS --- */}
            {loading ? (
            <ActivityIndicator size="large" color={COLORS.purple} style={{ marginTop: 20 }} />
            ) : (
            <>
                {/* SECCIÓN STICKERS */}
                <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Stickers</Text>
                <FlatList
                    data={stickers}
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
                            data={pins}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id}
                            renderItem={renderProductItem}
                            contentContainerStyle={{ paddingHorizontal: 20 }}
                            ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>No hay pines disponibles</Text>}
                        />
                </View>
            </>
            )}

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
    headerContainer: {
        backgroundColor: COLORS.purple,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 0,
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
        borderRadius: 20,
        backgroundColor: 'white',
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
    scrollContainer: {
        flex: 1,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.orange,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.purple
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
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
        color: '#FFD699',
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
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.purple,
        marginLeft: 20,
        marginBottom: 15,
    },
    productCard: {
        backgroundColor: COLORS.white,
        width: 150,
        height: 200,
        borderRadius: 15,
        padding: 10,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
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
        borderStyle: 'dashed',
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