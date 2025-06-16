import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/SessionContext.jsx";

const API = import.meta.env.VITE_BACKEND_URL + "/api";

export const CartPage = () => {
  const { store: session } = useContext(SessionContext);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  const token = session.token;

  const loadCart = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo cargar el carrito");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`${API}/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  const total = cart.reduce((acc, item) => acc + (item.product.precio || 0), 0);

  return (
    <div className="container mt-4">
      <h2 className="text-primary">🛒 Mi carrito</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {cart.length === 0 ? (
        <p className="text-muted">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.product.nombre}</strong> - {item.product.grupo} ({item.product.anio})<br />
                  💶 {item.product.precio} €
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                  🗑️ Eliminar
                </button>
              </li>
            ))}
          </ul>
          <p className="fw-bold mt-3 text-success">🧾 Total: {total} €</p>
        </>
      )}
    </div>
  );
};