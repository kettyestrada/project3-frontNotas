import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import './App.css';

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useToken();

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const resp = await fetch('http://localhost:8080/categories', {
        headers: {
          Authorization: token,
        },
      });
      const data = await resp.json();
      const results = [];

      if (resp.status === 200) {
        data.message.forEach((value) => {
          results.push({
            key: value.id,
            value: value.title,
          });
        });
        setCategories(results);
      } else {
        console.log(data);
        setError('Error retrieving categories: ' + data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      setError('Error retrieving categories: ' + error.message);
      setSuccess('');
    }
  }
  async function deleteCategory(id) {
    let method = 'delete';
    try {
      const resp = await fetch(`http://localhost:8080/category/${id}`, {
        method,
        headers: {
          Authorization: token,
        },
      });
      const data = await resp.json();
      if (resp.status === 200) {
        getCategories();
        alert('Categoria eliminada');
      } else if (resp.status === 500) {
        alert(
          'No se puede eliminar la categoría porque esta asociada a una nota'
        );
      } else {
        console.log(data);
        setError('Error deleting category: ' + data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      setError('Error deleting category: ' + error.message);
      setSuccess('');
    }
  }
  //No permite visualizar esta pantalla si el usuario no está logueado
  if (!token) return <Navigate to="/" />;

  return (
    <div>
      <h2>Categorías</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>CATEGORIA</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {categories.map((value, i) => (
            <tr key={value.value}>
              <td>{i + 1}</td>
              <td>{value.value}</td>
              <td>
                <button className="btn btn-warning">
                  <i className="fa-solid fa-edit"></i>
                </button>
                &nbsp;
                <button
                  onClick={() => deleteCategory(value.key)}
                  className="btn btn-danger"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="error">{error}</div>
      <div className="success">{success}</div>
    </div>
  );
};
export default CategoryList;
