import React from 'react';
import './Note.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const NoteView = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [note, setNote] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    async function fetchNote() {
      try {
        const resp = token
          ? await fetch(`http://localhost:8080/note/${id}`, {
              headers: {
                Authorization: token,
              },
            })
          : await fetch(`http://localhost:8080/note/${id}`);

        const data = await resp.json();
        console.log(data);

        if (resp.status === 200) {
          setNote(data.message);
        } else {
          console.log(data);
          setError('Error viewing note: ' + data.message);
        }
      } catch (error) {
        console.log('Error viewing note: ' + error.message);
        setError('Error viewing note: ' + error.message);
      }
    }
    fetchNote();
  }, []);

  function showImage(imageName) {
    return 'http://localhost:8080/' + imageName;
  }

  return (
    <div>
      <div className='error'>{error}</div>
      {note.category_id && <h4>{note.categoryTitle}</h4>}
      <h1>{note.title}</h1>
      {note.email && <div className='by'>By {note.email}</div>}
      {note.created_at && (
        <div className='created-time'>Created at {note.created_at}</div>
      )}
      {note.image && <img src={showImage(note.image)} alt={note.title} />}
      <p>{note.text}</p>

      <p>{note.id}</p>
    </div>
  );
};
export default NoteView;
