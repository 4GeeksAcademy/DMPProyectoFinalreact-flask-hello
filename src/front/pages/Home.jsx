import React, { useEffect, useState, useContext } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { SessionContext } from "../context/SessionContext.jsx";

const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const { store: session } = useContext(SessionContext);
  const user = session.user;
  const token = session.token;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const loadMessage = async () => {
    try {
      const res = await fetch(`${API}/hello`);
      const data = await res.json();
      if (res.ok) dispatch({ type: "set_hello", payload: data.message });
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
    if (!token) return;
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Carrito cargado:", data);
      setCart(data);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  const loadFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Favoritos cargados:", data);
      setFavorites(data);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  const addToCart = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        await loadCart();
      } else {
        const err = await res.json();
        console.error("Error al añadir al carrito:", err);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const addToFavorites = async (productId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        await loadFavorites();
      } else {
        const err = await res.json();
        console.error("Error al añadir a favoritos:", err);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    loadMessage();
    loadProducts();
    loadCart();
    loadFavorites();
  }, [token]);

  const totalCarrito = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + (item.product.precio || 0), 0)
    : 0;

  return (
    <div className="container py-4">
      <h2 className="text-primary mb-4">🎵 Productos disponibles</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={product.imagen_url}
                className="card-img-top"
                alt={product.nombre}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title text-primary">{product.nombre}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {product.grupo} ({product.anio})
                </h6>
                <p className="card-text">
                  <strong>Formato:</strong> {product.soporte}<br />
                  <strong>💶 Precio:</strong> {product.precio} €
                </p>
              </div>
              {token && (
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <button className="btn btn-success btn-sm" onClick={() => addToCart(product.id)}>🛒 Añadir</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => addToFavorites(product.id)}>❤️ Favorito</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {token && (
        <>
          <h2 className="text-primary mt-5">🛒 Carrito</h2>
          {Array.isArray(cart) && cart.length > 0 ? (
            <>
              <ul className="list-group mb-2">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between">
                    {item.product.nombre} - {item.product.grupo}
                    <span>💶 {item.product.precio} €</span>
                  </li>
                ))}
              </ul>
              <p className="fw-bold text-success">🧾 Total: {totalCarrito} €</p>
            </>
          ) : (
            <p className="text-muted">Tu carrito está vacío.</p>
          )}

          <h2 className="text-primary mt-5">❤️ Favoritos</h2>
          {Array.isArray(favorites) && favorites.length > 0 ? (
            <ul className="list-group">
              {favorites.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.product.nombre}</strong> - {item.product.grupo}
                  </div>
                  <span>💶 {item.product.precio} €</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Aún no tienes favoritos.</p>
          )}
        </>
      )}
    </div>
  );
};
