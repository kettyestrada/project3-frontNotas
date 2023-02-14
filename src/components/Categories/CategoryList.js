import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import './App.css';

export const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
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
  const handleSubmit = async (e) => {};

  //No permite visualizar esta pantalla si el usuario no está logueado
  if (!token) return <Navigate to="/" />;

  return (
    <main className="CategoryList">
      <h2>Categorías</h2>
      <form onSubmit={handleSubmit}>
        {/* <ul>
          {categories.map((value) => (
            <li key={value.key}>{value.value}</li>
          ))}
        </ul> */}
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
              <tr key={value.key}>
                <td>{i + 1}</td>
                <td>{value.value}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#modalProducts"
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  &nbsp;
                  <button className="btn btn-danger">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="error">{error}</div>
        <div className="success">{success}</div>
      </form>
    </main>
  );
};

export default CategoryList;
