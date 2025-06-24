import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../context/SessionContext.jsx";
import { useNavigate } from "react-router-dom";

const API = "https://vigilant-pancake-jj4px5j4g9gwhpjgq-3001.app.github.dev/api";

const FavoritesPage = () => {
  const { store } = useContext(SessionContext);
  const token = store.token;
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      const res = await fetch(`${API}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  const deleteFavorite = async (id) => {
  const url = `${API}/favorites/${id}`;
  console.log("Eliminando favorito con ID:", id);
  console.log("URL completa:", url);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      loadFavorites();
    } else {
      const err = await res.json();
      alert(err.error || "Error al eliminar de favoritos");
    }
  } catch (err) {
    console.error("Error al eliminar de favoritos:", err);
  }
};

  useEffect(() => {
    if (token) loadFavorites();
  }, [token]);

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate("/")}>
        🔙 Volver a la tienda
      </button>

      <h2 className="text-primary mb-4">❤️ Tus Favoritos</h2>
      {favorites.length > 0 ? (
        <div className="row">
          {favorites.map((item) => {
            const p = item.product;
            return (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img
                    src={p.imagen_url}
                    className="card-img-top"
                    alt={p.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.nombre}</h5>
                    <h6 className="card-subtitle text-muted mb-2">{p.grupo} ({p.anio})</h6>
                    <p className="card-text">
                      <strong>Formato:</strong> {p.soporte}<br />
                      <strong>💶 Precio:</strong> {p.precio} €<br />
                      <strong>Descripción:</strong><br />
                      {p.descripcion || "Sin descripción disponible"}
                    </p>
                  </div>
                  <div className="card-footer text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteFavorite(item.id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted">No tienes productos en favoritos.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
