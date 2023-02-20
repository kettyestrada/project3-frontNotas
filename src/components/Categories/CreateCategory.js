import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { showAlert, showSuccess } from '../../functions';
// import './App.css';

export const CreateCategory = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useToken();
  // Función que maneja el envío del formulario.

  //No permite visualizar esta pantalla si el usuario no está logueado
  if (!token) return <Navigate to="/" />;
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/category', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title,
        }),
      });
      const body = await res.json();

      //si ha ido bien o ha ido mal mostramos por alert el mensaje,
      // sea o no sea de error.
      if (body.status === 'error') {
        showAlert(body.message, 'warning');
      } else {
        setTitle('');
        showSuccess(body.message);
        //navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="CreateCategory">
      <h2>Categorías</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Category:</label>
        <input
          type="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
        {/* <button disabled={loading}>Submit</button> */}
        <button className=" boton">
          <i className="fa-solid fa-floppy-disk"></i> Guardar
        </button>
      </form>
    </main>
  );
};

export default CreateCategory;
