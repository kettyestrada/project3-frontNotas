import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import './NotesList.css';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showModal, setShowModal] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotes() {
      const resp = await fetch('http://localhost:8080/notes', {
        headers: {
          Authorization: token,
        },
      });
      const data = await resp.json();
      console.log(data);
      setNotes(data.message);
    }
    fetchNotes();
  }, []);

  const handleEdit = (id) => {
    console.log(`Editing note with id: ${id}`);
  };

  const handleDelete = (id) => {
    setShowModal(true);
    setNoteId(id);
  };

  const handleConfirmDelete = async (id) => {
    console.log(`Deleting note with id: ${id}`);
    try {
      const resp = await fetch(`http://localhost:8080/note/${id}`, {
        'Content-Type': 'multipart/form-data',
        headers: {
          Authorization: token,
        },
        method: 'DELETE',
      });
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      setShowModal(false);
    } catch (error) {
      setError(error);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setNoteId(null);
    setShowModal(false);
  };

  //Valida si se desea eliminar y llama la función de eliminar categoría
  function confirmDelete(id) {
    const mySwal = withReactContent(Swal);
    mySwal
      .fire({
        title: 'Are you sure you want to delete this note?',
        text: 'This action could not be reverted it',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleConfirmDelete(id);
        }
      });
  }

  return (
    <div className='App'>
      <div className='container-fluid'>
        <h2>Notes List</h2>
        {error && <p>Error:{error.message}</p>}
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.title}</td>
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
