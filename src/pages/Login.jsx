import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import { useAuth } from "../context/UseAuth";
import loginRequest from "../api/login";
import useToast from "../hooks/useToast";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    loginRequest(username, password)
    .then((data) => {
      showToast('Inicio de sesión', 'Sesión iniciada correctamente', 'success');
      login(data); // Call the login function with the token
    }
    ).catch((error) => {
      showToast('Error de inicio de sesión', 'Usuario o contraseña incorrectos', 'error');
    });

  };

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/dashboard';
    }

  }, []);

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
      <img src={Logo} className="w-42 h-12 mb-2" alt="Logo" />
      <div className="h-[60vh] lg:w-1/3 md:w-1/2 bg-white rounded-md border-2 flex flex-col items-center justify-center">
        {/* Attach onSubmit handler here */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="text-xl font-semibold p-4 text-center">Ingresar</div>
          <div className="p-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              type="text"
              name="usuario"
              id="usuario"
              className="mt-1 p-2 border rounded-md w-full bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update email state
              required
            />
          </div>
          <div className="p-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 p-2 border rounded-md w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>
          <div className="p-4">
            <button
              type="submit"
              className="bg-red-600 text-white p-2 rounded-md w-full"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
