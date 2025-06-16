import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/SessionContext.jsx";

const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

const FavoritesPage = () => {
  const { store } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    if (!store.token) return;
    try {
      const res = await fetch(`${API}/favorites`, {
        method: "GET",
        headers: { Authorization: "Bearer " + store.token }
      });
      const data = await res.json();
      if (res.ok) setFavorites(data);
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
    }
  };

  const deleteFavorite = async (itemId) => {
    try {
      const res = await fetch(`${API}/favorites/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + store.token }
      });
      if (res.ok) setFavorites(favorites.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [store.token]);

  return (
    <div className="container">
      <h2 className="text-primary my-4">❤️ Tus favoritos</h2>
      {favorites.length === 0 ? (
        <p className="text-muted">No tienes productos favoritos aún.</p>
      ) : (
        <div className="row">
          {favorites.map((item) => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <img src={item.product.imagen_url} className="card-img-top" alt={item.product.nombre} style={{ height: "200px", objectFit: "cover" }} />
                <div className="card-body">
                  <h5 className="card-title">{item.product.nombre}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{item.product.grupo}</h6>
                  <p className="card-text"><em>{item.product.descripcion}</em></p>
                  <p><strong>💶 Precio:</strong> {item.product.precio} €</p>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteFavorite(item.id)}>🗑 Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;