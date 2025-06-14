import React, { useState } from "react";
import { registerUser } from "../services/userService";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await registerUser(formData);
        console.log("Usuario registrado:", response);
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Nombre" onChange={handleChange} />
                <input type="email" name="email" placeholder="Correo" onChange={handleChange} />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
