import { useState } from 'react';
import { useNavigate, Navigate, NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { showAlert, showSuccess } from '../../functions';
import './Login.css';

const Login = () => {
  const [token, setToken] = useToken('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Si estamos logueados redireccionamos a la página principal
  if (token) return <Navigate to="/" />;

  // Función que maneja el envío del formulario.

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/user/login', {
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

      if (body.status === 'error') {
        showAlert(body.message, 'warning');
      } else {
        showSuccess(body.message);
        setToken(body.data.token);
        navigate('/noteslist');
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
    <main className="Login">
      <div className="divLogin">
        <h2>Login</h2>
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
            minLength="4"
            required
          />

          <button className="btn-login" disabled={loading}>
            Ingresar
          </button>
          <NavLink to="/register">Registrarme</NavLink>
        </form>
      </div>
    </main>
  );
};

export default Login;
