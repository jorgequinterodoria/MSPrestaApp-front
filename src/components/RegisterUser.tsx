import React, { useState } from "react";
import { createUser } from "../services/api";
import { hashPassword } from "../utils/encryption";

const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    status: "active",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Usamos hashPassword en lugar de encryptPassword
      const user = {
        email: formData.email,
        name: formData.name,
        password: hashPassword(formData.password),
        phone: formData.phone || undefined,
        role: "CLIENTE" as "CLIENTE",
        status: "active" as "active",
      };
      
      await createUser(user);
      setSuccess(true);
      setFormData({ 
        email: "", 
        name: "", 
        password: "", 
        confirmPassword: "", 
        phone: "", 
        status: "active" 
      });
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Error al registrar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">
        Registro de Usuario
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <div className="mt-1 relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Usuario registrado con éxito</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;