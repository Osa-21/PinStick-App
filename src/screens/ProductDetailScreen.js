import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Platform,
    StatusBar as RNStatusBar,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8C00',
    bg: '#f5f5f5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
    grayBg: '#E0E0E0',
};

const ProductDetailScreen = ({ navigation, route }) => {
  // Recibimos el producto seleccionado desde la pantalla anterior
    const { product } = route.params;
    
    // Estado para la cantidad
    const [quantity, setQuantity] = useState(1);

    const { addToCart, cartCount } = useCart();

    // Funciones para aumentar/disminuir cantidad
    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => {
        if (quantity > 1) {
        setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        console.log("🛒 Botón presionado en Detalle para:", product.name);
        
        // Llamamos a la función que escribe en la BD
        await addToCart(product, quantity);

        // Solo mostramos la alerta después de intentar guardar
        Alert.alert(
        "¡Agregado!",
        `Has agregado ${quantity} unidad(es) de ${product.name} al carrito.`,
        [
            { text: "Seguir comprando", onPress: () => navigation.goBack() },
            { text: "Ir al Carrito", onPress: () => navigation.navigate('Cart') }
        ]
        );
    };

    return (
        <View style={styles.container}>
        {/* 1. HEADER SUPERIOR (Transparente o Flotante) */}
        <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detalle</Text>
            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="cart-outline" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* 2. IMAGEN DEL PRODUCTO */}
            <View style={styles.imageContainer}>
            <Image 
                source={{ uri: product.imageUrl || product.image || 'https://via.placeholder.com/300' }} 
                style={styles.productImage} 
                resizeMode="contain"
            />
            </View>

            {/* 3. CONTENEDOR DE INFORMACIÓN (Fondo blanco con esquinas redondeadas) */}
            <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
            </View>

            {/* Categoría o Etiqueta */}
            <View style={styles.tagContainer}>
                <Text style={styles.tagText}>
                {product.category ? product.category.toUpperCase() : 'PRODUCTO'}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>
                {product.description || "Este es un producto increíble de la colección Pin & Stick. Alta calidad, diseño único y perfecto para personalizar tu estilo."}
            </Text>

            {/* 4. SELECTOR DE CANTIDAD */}
            <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Cantidad</Text>
                <View style={styles.quantityControls}>
                <TouchableOpacity onPress={decrementQuantity} style={styles.quantityBtn}>
                    <Ionicons name="remove" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.quantityNumber}>{quantity}</Text>
                <TouchableOpacity onPress={incrementQuantity} style={styles.quantityBtn}>
                    <Ionicons name="add" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </ScrollView>

        {/* 5. FOOTER CON BOTÓN DE ACCIÓN (Fijo abajo) */}
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Agregar al Carrito</Text>
            <Text style={styles.totalPriceText}>
                ${(parseFloat(product.price.toString().replace('$','')) * quantity).toFixed(2)}
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    headerSafeArea: {
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
        backgroundColor: COLORS.bg, // O transparente si prefieres que la imagen suba
        zIndex: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    iconButton: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    scrollContent: {
        paddingBottom: 100, // Espacio para el footer fijo
    },
    imageContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    productImage: {
        width: '80%',
        height: '80%',
    },
    infoContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        marginTop: -20, // Efecto de superposición sobre la imagen
        minHeight: 500, // Para asegurar que cubra hacia abajo
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        flex: 1,
        marginRight: 10,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.purple,
    },
    tagContainer: {
        backgroundColor: '#F0E6FA', // Morado muy claro
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    tagText: {
        color: COLORS.purple,
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.textLight,
        lineHeight: 22,
        marginBottom: 30,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
        borderRadius: 20,
        paddingHorizontal: 5,
    },
    quantityBtn: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 17.5,
        margin: 5,
        elevation: 1,
    },
    quantityNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
        color: COLORS.textDark,
    },
    // FOOTER
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        elevation: 10,
    },
    addToCartButton: {
        backgroundColor: COLORS.orange,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    addToCartText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalPriceText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
});

export default ProductDetailScreen;