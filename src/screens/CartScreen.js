import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar as RNStatusBar,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF9900',
    bg: '#f5f5f5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
    red: '#FF3B30'
};

const CartScreen = ({ navigation }) => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
        <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
            style={styles.itemImage} 
            resizeMode="contain"
        />
        
        <View style={styles.itemDetails}>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <Text style={styles.itemCategory}>{item.category?.toUpperCase()}</Text>
        </View>

        <View style={styles.actionsContainer}>
            {/* Controles de Cantidad */}
            <View style={styles.quantityControls}>
            <TouchableOpacity 
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                style={styles.qtyBtn}
            >
                <Ionicons name="remove" size={16} color={COLORS.textDark} />
            </TouchableOpacity>
            
            <Text style={styles.qtyText}>{item.quantity}</Text>
            
            <TouchableOpacity 
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                style={styles.qtyBtn}
            >
                <Ionicons name="add" size={16} color={COLORS.textDark} />
            </TouchableOpacity>
            </View>

            {/* Botón Eliminar */}
            <TouchableOpacity 
            onPress={() => removeFromCart(item.id)}
            style={styles.deleteBtn}
            >
            <Ionicons name="trash-outline" size={20} color={COLORS.red} />
            </TouchableOpacity>
        </View>
        </View>
    );

    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mi Carrito</Text>
            <View style={{width: 24}} /> 
            </View>
        </SafeAreaView>

        {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Main')} // O 'Explorar'
            >
                <Text style={styles.exploreButtonText}>Ir a comprar</Text>
            </TouchableOpacity>
            </View>
        ) : (
            <>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            
            {/* Footer con Total y Pagar */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={() => Alert.alert("Próximamente", "Integración de pagos pendiente.")}
                >
                <Text style={styles.checkoutText}>Proceder al Pago</Text>
                </TouchableOpacity>
            </View>
            </>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    headerSafeArea: {
        backgroundColor: COLORS.purple,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    flatList: {
        flex: 1, 
    },
    listContent: {
        padding: 20,
        paddingBottom: 160, 
    },
    // --- ESTILOS CORREGIDOS AQUÍ ---
    cartItem: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        // alignItems: 'center', <--- ELIMINADO: Esto causaba el conflicto
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        minHeight: 100, 
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
        alignSelf: 'center', // <--- NUEVO: Centra la imagen verticalmente
    },
    itemDetails: {
        flex: 1,
        marginRight: 10,
        alignSelf: 'center', // <--- NUEVO: Centra el texto verticalmente
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    itemPrice: {
        fontSize: 14,
        color: COLORS.purple,
        fontWeight: 'bold',
        marginTop: 4,
    },
    itemCategory: {
        fontSize: 10,
        color: COLORS.textLight,
        marginTop: 2,
    },
    actionsContainer: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        // height: '100%', <--- ELIMINADO: Esto estiraba la tarjeta
        paddingVertical: 0, 
    },
    // -------------------------------
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
        borderRadius: 20,
        marginBottom: 10,
    },
    qtyBtn: {
        padding: 5,
    },
    qtyText: {
        marginHorizontal: 8,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    deleteBtn: {
        padding: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.textLight,
        marginTop: 20,
        marginBottom: 30,
    },
    exploreButton: {
        backgroundColor: COLORS.purple,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    exploreButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
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
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        color: COLORS.textDark,
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.purple,
    },
    checkoutButton: {
        backgroundColor: COLORS.orange,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    checkoutText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CartScreen;