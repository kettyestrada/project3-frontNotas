import React, { useState, useEffect } from 'react';
import './NotesList.css';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showModal, setShowModal] = useState(false);
  const [noteId, setNoteId] = useState(null);

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

  const handleConfirmDelete = async () => {
    console.log(`Deleting note with id: ${noteId}`);
    const resp = await fetch(`http://localhost:8080/note/${noteId}`, {
      'Content-Type': 'multipart/form-data',
      headers: {
        Authorization: token,
      },
      method: 'DELETE',
    });
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleView = (id) => {
    console.log(`Viewing note with id: ${id}`);
  };

  return (
    <div>
      <h2>Notes List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.title}</td>
              <td>
                <button onClick={() => handleView(note.id)}>View</button>
                <button onClick={() => handleEdit(note.id)}>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <p>Are you sure you want to delete this note?</p>
            <div className='modal-actions'>
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesList;
