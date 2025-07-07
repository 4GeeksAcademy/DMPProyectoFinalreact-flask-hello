import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/SessionContext.jsx";
import { useNavigate } from "react-router-dom";


const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

export const CartPage = () => {
  const { store } = useContext(SessionContext);
  const token = store.token;
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`${API}/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadCart();
      } else {
        const err = await res.json();
        alert(err.error || "Error al eliminar del carrito");
      }
    } catch (err) {
      console.error("Error al eliminar del carrito:", err);
    }
  };



const handlePayment = async () => {
  try {
    const res = await fetch(`${API}/create-checkout-session`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Error en la solicitud");

    const data = await res.json();
     window.open(data.url, "_blank"); // Redirige al checkout de Stripe
  } catch (err) {
    console.error("Error iniciando pago:", err);
    alert("No se pudo iniciar el proceso de pago");
  }
};



  useEffect(() => {
    if (token) loadCart();
  }, [token]);

  const total = cart.reduce((sum, item) => sum + (item.product.precio || 0), 0);

  return (

    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate("/")}>
        🔙 Volver a la tienda
      </button>

      <h2 className="text-primary mb-4">🛒 Tu Carrito</h2>
      {cart.length > 0 ? (
        <>
          <ul className="list-group mb-3">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.product.nombre}</strong> - {item.product.grupo}
                </div>
                <div>
                  <span className="me-3">💶 {item.product.precio} €</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
                    Eliminar
                  </button>


                </div>
              </li>
            ))}
          </ul>
          <p className="fw-bold text-success">🧾 Total: {total} €</p>
          <button className="btn btn-success" onClick={handlePayment}>
            💳 Pagar con tarjeta
          </button>
        </>
      ) : (
        <p className="text-muted">Tu carrito está vacío.</p>
      )}
    </div>
  );
};
