import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { useEffect } from 'react';
import { showAlert, showSuccess } from '../../functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './CategoryList.css';

export const CategoryList = ({ categories, setCategories }) => {
  const [title, setTitle] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const [titleModal, setTitleModal] = useState('');
  const [operation, setOperation] = useState(1);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useToken();

  // Función para crear categoría.
  async function updateCategory() {
    try {
      const res = await fetch(`http://localhost:8080/category/${idCategory}`, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
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
        document.getElementById('btnCerrar').click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  //Abre el modal y carga los datos según desde donde se llame
  const openModal = (op, title, idCategory) => {
    setTitle('');
    setIdCategory('');
    setOperation(op);
    if (op === 1) {
      setTitleModal('Registrar Categoría');
    } else if (op === 2) {
      setTitleModal('Editar Categoría');
      setTitle(title);
      setIdCategory(idCategory);
    }
    window.setTimeout(function () {
      document.getElementById('title').focus();
    }, 500);
  };
  // Valida las acciones de guardar/actualizar desde el modal
  const validate = () => {
    if (title.trim() === '') {
      showAlert('Escribe el nombre de la categoría', 'warning');
    } else {
      if (operation === 1) {
        //crear categoria
        createCategory();
      } else {
        //actualizar categoria
        updateCategory();
        //showAlert('actualizar categoria', 'success');
      }
    }
  };

  //Valida si se desea eliminar y llama la función de eliminar categoría
  function confirmDelete(id) {
    const mySwal = withReactContent(Swal);
    mySwal
      .fire({
        title: 'Está seguro de eliminar la categoría?',
        text: 'Esta acción no se podrá revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteCategory(id);
        }
      });
  }

  // Función para crear categoría.
  async function createCategory() {
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
        document.getElementById('btnCerrar').click();

        //navigate('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Función para eliminar categoría por id
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
        showSuccess('Categoría eliminada');
      } else if (resp.status === 500) {
        showAlert(
          'No se puede eliminar la categoría porque esta asociada a una nota',
          'warning'
        );
      } else {
        console.log(data);
        showAlert(data.message, 'warning');
      }
    } catch (error) {
      showAlert(error.message, 'warning');
    }
  }

  //No permite visualizar esta pantalla si el usuario no está logueado
  if (!token) return <Navigate to="/" />;

  return (
    <main>
      <div className="note">
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-md-4 offset-md-4">
              <div className="d-grid mx-auto">
                <button
                  onClick={() => openModal(1)}
                  className="btn btn-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#modalProducts"
                >
                  <i className="fa-solid fa-circle-plus"></i> Añadir
                </button>
              </div>
            </div>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {categories.map((value, i) => (
                <tr key={value.value}>
                  <td>{i + 1}</td>
                  <td>{value.value}</td>
                  <td className="tdActions">
                    <button
                      onClick={() => openModal(2, value.value, value.key)}
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#modalProducts"
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    &nbsp;
                    <button
                      onClick={() => confirmDelete(value.key)}
                      className="btn btn-danger"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="modalProducts" className="modal fade" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{titleModal}</label>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input type="hidden" id="id"></input>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i class="fa-solid fa-file-circle-plus"></i>
                  </span>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Categoría"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button
                    onClick={() => validate()}
                    className="btn btn-success"
                  >
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="btnCerrar"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default CategoryList;
