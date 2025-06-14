import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { SessionContext } from "../context/SessionContext.jsx";


const mockUserId = 1;
const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const loadMessage = async () => {
    try {
      if (!API) throw new Error("VITE_BACKEND_URL is not defined in .env file");
      const response = await fetch(API + "/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
    } catch (error) {
      console.error("Mensaje de error:", error.message);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const loadCart = async () => {
    try {
      const res = await fetch(`${API}/cart?user_id=${mockUserId}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await fetch(`${API}/favorites?user_id=${mockUserId}`);
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  const addToCart = (productId) => {
    fetch(`${API}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: mockUserId, product_id: productId })
    }).then(() => loadCart());
  };

  const addToFavorites = (productId) => {
    fetch(`${API}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: mockUserId, product_id: productId })
    }).then(() => loadFavorites());
  };

  useEffect(() => {
    loadMessage();
    loadProducts();
    loadCart();
    loadFavorites();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 p-4 bg-purple-100 text-purple-800 rounded shadow">
        {store.message ? (
          <span>{store.message}</span>
        ) : (
          <span className="text-purple-500">
            Cargando mensaje del backend...
          </span>
        )}
      </div>

      <h2 className="text-xl font-bold text-purple-700 mb-4">🎵 Productos disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-800">{product.nombre}</h2>
            <p className="text-purple-600">{product.grupo} ({product.anio})</p>
            <p className="italic text-purple-500">Formato: {product.soporte}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => addToCart(product.id)}
                className="bg-purple-500 text-white px-2 py-1 rounded"
              >🛒 Añadir</button>
              <button
                onClick={() => addToFavorites(product.id)}
                className="bg-purple-300 text-white px-2 py-1 rounded"
              >❤️ Favorito</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold text-purple-700 mb-2">🛒 Carrito</h2>
        {cart.length === 0 ? (
          <p className="text-purple-500">Tu carrito está vacío.</p>
        ) : (
          <ul className="list-disc list-inside">
            {cart.map((item) => (
              <li key={item.id}>{item.nombre} - {item.grupo}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-purple-700 mb-2">❤️ Favoritos</h2>
        {favorites.length === 0 ? (
          <p className="text-purple-500">Aún no tienes favoritos.</p>
        ) : (
          <ul className="list-disc list-inside">
            {favorites.map((item) => (
              <li key={item.id}>{item.nombre} - {item.grupo}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
