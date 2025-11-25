import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    StatusBar as RNStatusBar,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const COLORS = {
    purple: '#5E2B87',
    orange: '#FF8c00',
    bg: '#f5f5f5',
    white: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
};

const ExploreScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchText, setSearchText] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
        const productsRef = collection(db, 'products');
        let q = productsRef;

        if (selectedCategory !== 'Todos') {
            q = query(productsRef, where('category', '==', selectedCategory.toLowerCase()));
        }

        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProducts(productsList);
        } catch (error) {
        console.error("Error obteniendo productos: ", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderCategoryFilter = () => (
        <View style={styles.categoryContainer}>
        {['Todos', 'Pines', 'Stickers'].map((category) => (
            <TouchableOpacity
            key={category}
            style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
            >
            <Text
                style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
                ]}
            >
                {category}
            </Text>
            </TouchableOpacity>
        ))}
        </View>
    );

    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productCard}>
        <Image 
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
            style={styles.productImage} 
            resizeMode="contain"
        />
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
        {/* --- HEADER UNIFICADO --- */}
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
                    value={searchText}
                    onChangeText={setSearchText}
                />
                </View>
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
        {/* ------------------------ */}

        <View style={styles.contentContainer}>
            {renderCategoryFilter()}

            {/* --- NUEVO: Subtítulo "Destacados" --- */}
            <Text style={styles.sectionTitle}>Destacados</Text>
            {/* ------------------------------------ */}

            {loading ? (
            <ActivityIndicator size="large" color={COLORS.purple} style={{ marginTop: 50 }} />
            ) : (
            <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productList}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={
                <Text style={styles.emptyText}>No se encontraron productos.</Text>
                }
            />
            )}
        </View>
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
    contentContainer: {
        flex: 1,
        paddingTop: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15, // Reducimos un poco el margen inferior aquí
    },
    // --- NUEVO ESTILO para el subtítulo ---
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: COLORS.purple,
        marginLeft: 20,
        marginBottom: 15,
    },
    // --------------------------------------
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    categoryButtonActive: {
        backgroundColor: COLORS.orange,
    },
    categoryText: {
        color: COLORS.textLight,
        fontWeight: '600',
    },
    categoryTextActive: {
        color: COLORS.white,
    },
    productList: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: COLORS.white,
        width: '48%',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: 120,
        marginBottom: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.purple,
    },
    addButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.orange,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: COLORS.textLight,
    },
});

export default ExploreScreen;