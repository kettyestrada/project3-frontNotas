import React, { useState, useEffect } from 'react';
import './NotesList.css';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

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
    console.log(`Deleting note with id: ${id}`);
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
    </div>
  );
}

export default NotesList;
