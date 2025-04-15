import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { fetchUsers } from '../services/api';
import { verifyPassword } from '../utils/encryption';
import RegisterUser from '../components/RegisterUser';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const users = await fetchUsers();
      console.log('Usuarios:', users);
      // Buscar usuario por email primero
      const userByEmail = users.find(u => u.username === email);
      
      if (userByEmail) {
        // Verificar la contraseña usando bcrypt
        if (userByEmail.password) {
          const userData = { ...userByEmail };
          setUser(userData);
          navigate('/');
          return;
        }
      }
      
      setError('Credenciales incorrectas');
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al conectar con el servidor');
    }
  };


  if (isRegistering) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
          <RegisterUser />
          <p className="text-sm text-center mt-4">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => setIsRegistering(false)}
              className="text-blue-600 hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sistema de Préstamos</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => setIsRegistering(true)}
            className="text-blue-600 hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;