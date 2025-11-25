import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Alert } from 'react-native';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Detectar usuario logueado
  useEffect(() => {
    console.log("🔄 Iniciando listener de Auth...");
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("👤 Estado de Auth cambió. Usuario:", currentUser ? currentUser.uid : "Sin usuario");
      setUser(currentUser);
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  // 2. Sincronizar con Firestore
  useEffect(() => {
    let unsubscribeSnapshot;
    if (user) {
      console.log("🔗 Conectando al carrito de:", user.uid);
      const cartRef = doc(db, 'carts', user.uid);
      
      unsubscribeSnapshot = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const items = docSnap.data().items || [];
          console.log("📥 Datos recibidos de Firestore:", items.length, "items");
          setCartItems(items);
        } else {
          console.log("🆕 El documento del carrito no existe. Se creará al agregar algo.");
          setCartItems([]);
        }
        setLoading(false);
      }, (error) => {
        console.error("❌ Error CRÍTICO en Snapshot:", error);
        Alert.alert("Error de Base de Datos", error.message);
      });
    }
    return () => { if (unsubscribeSnapshot) unsubscribeSnapshot(); };
  }, [user]);

  // --- FUNCIÓN DE GUARDADO ---
  const saveToFirebase = async (newItems) => {
    // DIAGNÓSTICO: Verificar si hay usuario antes de guardar
    if (!user) {
      console.error("❌ INTENTO DE GUARDADO FALLIDO: No hay usuario autenticado en el contexto.");
      Alert.alert("Error", "No se detectó un usuario autenticado. Intenta cerrar sesión y volver a entrar.");
      return;
    }

    try {
      console.log(`💾 Intentando escribir ${newItems.length} items en: carts/${user.uid}`);
      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, { items: newItems }, { merge: true });
      console.log("✅ ¡ESCRITURA CONFIRMADA EN FIREBASE!");
    } catch (error) {
      console.error("❌ Error al ejecutar setDoc:", error);
      Alert.alert("Error de Escritura", "Firebase rechazó el guardado: " + error.message);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    console.log("➕ addToCart llamado para:", product.name);

    if (!user) {
      Alert.alert("Atención", "Inicia sesión para comprar");
      return;
    }

    // Sanitización
    const safeProduct = {
      id: product.id || `temp-${Date.now()}`,
      name: product.name || 'Sin Nombre',
      price: Number(product.price) || 0, // Asegura que sea número
      image: product.imageUrl || product.image || 'https://via.placeholder.com/150',
      category: product.category || 'general',
      quantity: Number(quantity) || 1
    };

    let updatedCart = [...cartItems];
    const index = updatedCart.findIndex((item) => item.id === safeProduct.id);

    if (index >= 0) {
      updatedCart[index].quantity += safeProduct.quantity;
    } else {
      updatedCart.push(safeProduct);
    }

    await saveToFirebase(updatedCart);
  };

  // Resto de funciones (sin cambios mayores)
  const removeFromCart = async (productId) => {
    if (!user) return;
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    await saveToFirebase(updatedCart);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!user || newQuantity < 1) return;
    const updatedCart = cartItems.map((item) => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    await saveToFirebase(updatedCart);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const cartTotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    return acc + (price * (item.quantity || 1));
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, loading, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};