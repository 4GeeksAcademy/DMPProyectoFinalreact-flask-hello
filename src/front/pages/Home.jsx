import React, { useEffect, useState, useContext } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { SessionContext } from "../context/SessionContext.jsx";
import FavoritesPage from "./FavoritesPage.jsx";
import { CartPage } from "./CartPage.jsx";
import { useNavigate } from "react-router-dom"; // ✅ sin signos +


const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const { store: session, actions } = useContext(SessionContext);
  const user = session.user;
  const token = session.token;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const loadMessage = async () => {
    try {
      const res = await fetch(`${API}/hello`);
      const data = await res.json();
      if (res.ok) dispatch({ type: "set_hello", payload: data.message });
    } catch (error) {
      console.error("Mensaje de error:", error.message);
    }
  };

  const navigate = useNavigate();

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
      if (res.status === 401) actions.handleTokenExpiration(res);
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
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
      if (res.status === 401) actions.handleTokenExpiration(res);
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  const addToCart = async (productId) => {
    if (!token || !productId) return;
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) await loadCart();
      else alert("Error al añadir al carrito");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const addToFavorites = async (productId) => {
    if (!token || !productId) return;
    try {
      const res = await fetch(`${API}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) await loadFavorites();
      else alert("Error al añadir a favoritos");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleLogin = async () => {
    try {
      await actions.login(loginForm.email, loginForm.password);
      await loadCart();
      await loadFavorites();
    } catch (err) {
      alert(err.message);
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
    <div className="container py-4" style={{ backgroundColor: "#f8f0ff" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-purple" onClick={() => navigate("/home")}>🎵 Ferretería Musical</h2>
        {token ? (
          <div>
            <button className="btn btn-primary btn-sm me-2" onClick={() => navigate("/favorites")}>Favoritos</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/cart")}>Carrito</button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <input type="email" placeholder="Email" value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
            <input type="password" placeholder="Password" value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button className="btn btn-primary btn-sm" onClick={handleLogin}>Iniciar sesión</button>
          </div>
        )}
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100 border border-purple">
              <img src={product.imagen_url} className="card-img-top" alt={product.nombre}
                style={{ height: "200px", objectFit: "cover" }} />
              <div className="card-body">
                <h5 className="card-title text-purple">{product.nombre}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{product.grupo} ({product.anio})</h6>
                <p className="card-text">
                  <strong>Formato:</strong> {product.soporte}<br />
                  <strong>💶 Precio:</strong> {product.precio} €
                </p>
              </div>
              {token && (
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <button className="btn btn-outline-success btn-sm" onClick={() => addToCart(product.id)}>🛒 Añadir</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => addToFavorites(product.id)}>❤️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {token && (
        <>
          <h3 className="text-purple mt-5">🛒 Carrito</h3>
          {cart.length > 0 ? (
            <>
              <ul className="list-group mb-2">
                {cart.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between">
                    {item.product.nombre} - {item.product.grupo}
                    <span>{item.product.precio} €</span>
                  </li>
                ))}
              </ul>
              <p className="fw-bold text-success">🧾 Total: {totalCarrito} €</p>
            </>
          ) : <p className="text-muted">Tu carrito está vacío.</p>}

          <h3 className="text-purple mt-5">❤️ Favoritos</h3>
          {favorites.length > 0 ? (
            <ul className="list-group">
              {favorites.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{item.product.nombre}</strong> - {item.product.grupo}
                  </div>
                  <span>{item.product.precio} €</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-muted">Aún no tienes favoritos.</p>}
        </>
      )}
    </div>
  );
};
