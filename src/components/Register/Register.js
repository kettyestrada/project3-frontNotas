import { useState } from 'react';
import { Navigate, useNavigate, NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { showAlert, showSuccess } from '../../functions';
import './Register.css';

const Register = () => {
  const [token, setToken] = useToken();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" />;

  // Función que maneja el envío del formulario.

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/user', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const body = await res.json();

      //si ha ido bien o ha ido mal mostramos por alert el mensaje,
      // sea o no sea de error.
      if (body.status === 'error') {
        showAlert(body.message, 'warning');
      } else {
        showSuccess(body.message);
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      showAlert(
        'En estos momentos el sistema no se encuentra disponible, intente más tarde',
        'warning'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="Register">
      <div className="divRegister">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <label htmlFor="pass">Contraseña:</label>
          <input
            type="password"
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />

          <button className="btn-register" disabled={loading}>
            Registrarse
          </button>
          <NavLink to="/login">Iniciar sesión</NavLink>
        </form>
      </div>
    </main>
  );
};

export default Register;
