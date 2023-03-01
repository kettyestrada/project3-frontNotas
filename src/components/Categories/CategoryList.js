import { useState } from 'react';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import './CategoryList.css';

export const CategoryList = ({ categories, setCategories }) => {
  const [token] = useToken();

  const [title, setTitle] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [action, setAction] = useState(1);
  const [loading, setLoading] = useState(false);

  //No permite visualizar esta pantalla si el usuario no está logueado
  if (!token) return <Navigate to="/" />;

  /**
   * #####################
   * ## Crear categoria ##
   * #####################
   */
  async function createCategory() {
    try {
      setLoading(true);
      if (title === '') {
        showAlert('La categoría no puede estar vacía', 'error');
      } else {
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
          setCategories([...categories, body.data.category]);
          showSuccess(body.message);
          document.getElementById('btnCerrar').click();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * ##########################
   * ## Actualizar categoria ##
   * #########################
   */
  async function updateCategory() {
    try {
      setLoading(true);
      if (title === '') {
        showAlert('La categoría no puede estar vacía', 'error');
      } else {
        const res = await fetch(
          `http://localhost:8080/category/${idCategory}`,
          {
            method: 'PATCH',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              Authorization: token,
            },
            body: JSON.stringify({
              title,
            }),
          }
        );
        const body = await res.json();

        //si ha ido bien o ha ido mal mostramos por alert el mensaje,
        // sea o no sea de error.
        if (body.status === 'error') {
          showAlert(body.message, 'warning');
        } else {
          // creamos un nuevo array de categorias manteniendo todas las categorías
          //existentes, pero modificando la categoría que acabamos de editar
          const modifyCategories = categories.map((currentCategory) => {
            if (currentCategory.id === idCategory) {
              currentCategory.title = title;
            }

            return currentCategory;
          });

          setCategories(modifyCategories);

          setTitle('');
          showSuccess(body.message);
          document.getElementById('btnCerrar').click();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * #######################
   * ## Eliminar categoria ##
   * #######################
   */
  async function deleteCategory(id) {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/category/${id}`, {
        method: 'delete',
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();

      if (res.status === 200) {
        showSuccess('Categoría eliminada');

        const modifyCategories = categories.filter((currentCategory) => {
          return currentCategory.id !== id;
        });

        setCategories(modifyCategories);
      } else if (res.status === 500) {
        showAlert(
          'No se puede eliminar la categoría porque esta asociada a una nota',
          'warning'
        );
      } else {
        showAlert(data.message, 'warning');
      }
    } catch (error) {
      showAlert(error.message, 'warning');
    } finally {
      setLoading(false);
    }
  }

  /**
   * #############################
   * ## Confirmar borrar categoría ##
   * #############################
   */
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

  /**
   * ###########
   * ## Modal ##
   * ##########
   */
  function openModal(op, title, idCategory) {
    setTitle('');
    setIdCategory('');

    if (op === 1) {
      setCategoryName('Registrar Categoría');
      setAction(1);
    } else if (op === 2) {
      setCategoryName('Editar Categoría');
      setAction(2);
      setTitle(title);
      setIdCategory(idCategory);
    }
  }

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
              {categories.map((currentCategory, i) => (
                <tr key={currentCategory.id}>
                  <td>{i + 1}</td>
                  <td>{currentCategory.title}</td>
                  <td className="tdActions">
                    <button
                      onClick={() =>
                        openModal(2, currentCategory.title, currentCategory.id)
                      }
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#modalProducts"
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    &nbsp;
                    <button
                      onClick={() => confirmDelete(currentCategory.id)}
                      className="btn btn-danger"
                      disabled={loading}
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
                <label className="h5">{categoryName}</label>
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
                    <i className="fa-solid fa-file-circle-plus"></i>
                  </span>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Categoría"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                  ></input>
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button
                    onClick={() => {
                      action === 1 ? createCategory() : updateCategory();
                    }}
                    className="btn btn-success"
                    id="btnGuardar"
                    disabled={loading}
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
