import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const NoteView = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [note, setNote] = useState([]);

  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    async function fetchNote() {
      try {
        const resp = await fetch(`http://localhost:8080/note/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        const data = await resp.json();
        console.log(data);

        if (resp.status === 200) {
          setNote(data.message);
        } else {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchNote();
  }, []);

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.text}</p>
    </div>
  );
};
export default NoteView;
