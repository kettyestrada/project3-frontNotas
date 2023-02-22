import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { showAlert, showSuccess } from '../../functions';
import Swal from 'sweetalert2';
import './NotesList.css';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem('token');

  //Solo solicita las categorias si el usuario está logueado.
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, []);

  async function fetchNotes() {
    try {
      const response = await fetch('http://localhost:8080/notes', {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();

      if (response.status === 200) {
        setNotes(data.message);
      } else {
        console.log(data);
        showAlert('Error al obtener las notas: ' + data.message, 'warning');
      }
    } catch (error) {
      showAlert('Error al obtener las notas: ' + error.message, 'warning');
    }
  }

  const handleConfirmDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/note/${id}`, {
        'Content-Type': 'multipart/form-data',
        headers: {
          Authorization: token,
        },
        method: 'DELETE',
      });
      const updatedNotes = notes.filter((note) => note.id !== id);
      showSuccess('Nota eliminada satisfactoriamente');
      setNotes(updatedNotes);
    } catch (error) {
      showAlert('Error al eliminar la nota: ' + error.message, 'warning');
    }
  };

  //Valida si se desea eliminar y llama la función de eliminar categoría
  function confirmDelete(id) {
    const mySwal = withReactContent(Swal);
    mySwal
      .fire({
        title: 'Está seguro que desea eliminar esta nota?',
        text: 'Esta acción no podrá revertirse',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si',
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleConfirmDelete(id);
        }
      });
  }

  if (!token) return <Navigate to='/' />;

  return (
    <div className='App'>
      <div className='container-fluid'>
        <h2>Listar notas</h2>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.title}</td>
                <td>
                  {note.categoryTitle ? note.categoryTitle : 'Sin Categoria'}
                </td>
                <td>
                  <Link to={`/notes/${note.id}`} className='btn btn-info'>
                    <i className='fa-solid fa-eye'></i>
                  </Link>
                  <Link
                    to={`/notes/${note.id}/edit`}
                    className='btn btn-warning'
                  >
                    <i className='fa-solid fa-edit'></i>
                  </Link>
                  <Link
                    onClick={() => confirmDelete(note.id)}
                    className='btn btn-danger'
                  >
                    <i className='fa-solid fa-trash'></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotesList;
