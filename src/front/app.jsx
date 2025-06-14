// Este es un esquema base completo para la tienda musical
// Contiene las vistas Home, Cart, Favorites y un formulario de login

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const mockUserId = 1; // Simulamos un usuario logueado
const API = "http://localhost:5000/api";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">🎵 Rythm & Blues</h1>
      <div className="space-x-4">
        <Link to="/" className="text-blue-600">Home</Link>
        <Link to="/cart" className="text-blue-600">Cart</Link>
        <Link to="/favorites" className="text-blue-600">Favorites</Link>
        <Link to="/login" className="text-blue-600">Login</Link>
      </div>
    </nav>
  );
}

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/products`).then(res => res.json()).then(data => setProducts(data));
  }, []);

  const addToCart = (productId) => {
    fetch(`${API}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: mockUserId, product_id: productId })
    });
  };

  const addToFavorites = (productId) => {
    fetch(`${API}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: mockUserId, product_id: productId })
    });
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">{product.nombre}</h2>
          <p>{product.grupo} ({product.anio})</p>
          <p className="italic">Formato: {product.soporte}</p>
          <div className="mt-2 space-x-2">
            <button onClick={() => addToCart(product.id)} className="bg-blue-500 text-white px-2 py-1 rounded">🛒 Añadir</button>
            <button onClick={() => addToFavorites(product.id)} className="bg-pink-500 text-white px-2 py-1 rounded">❤️ Favorito</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/cart?user_id=${mockUserId}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const removeFromCart = (productId) => {
    fetch(`${API}/cart/${productId}?user_id=${mockUserId}`, { method: "DELETE" })
      .then(() => setItems(items.filter(i => i.id !== productId)));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Carrito</h2>
      {items.map(item => (
        <div key={item.id} className="bg-white p-4 mb-2 rounded shadow flex justify-between">
          <span>{item.nombre} - {item.grupo}</span>
          <button onClick={() => removeFromCart(item.id)} className="text-red-600">Eliminar</button>
        </div>
      ))}
    </div>
  );
}

function Favorites() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/favorites?user_id=${mockUserId}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const removeFromFavorites = (productId) => {
    fetch(`${API}/favorites/${productId}?user_id=${mockUserId}`, { method: "DELETE" })
      .then(() => setItems(items.filter(i => i.id !== productId)));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">❤️ Favoritos</h2>
      {items.map(item => (
        <div key={item.id} className="bg-white p-4 mb-2 rounded shadow flex justify-between">
          <span>{item.nombre} - {item.grupo}</span>
          <button onClick={() => removeFromFavorites(item.id)} className="text-red-600">Eliminar</button>
        </div>
      ))}
    </div>
  );
}

function LoginForm() {
  const [form, setForm] = useState({ username: "", email: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    }).then(res => res.json()).then(data => {
      console.log("Usuario creado:", data);
      // puedes redirigir o guardar info en sessionStorage
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Nombre de usuario" className="w-full p-2 border rounded" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
      </form>
    </div>
  );
}

export default App;
