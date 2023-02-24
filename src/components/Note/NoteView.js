import React from 'react';
import './Note.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { showAlert, showSuccess } from '../../functions';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const NoteView = () => {
  const token = localStorage.getItem('token');
  const [note, setNote] = useState([]);
  const [text, setText] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

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

        if (resp.status === 200) {
          setNote(data.message);
          const note = data.message;
          const localDate = moment(note.created_at)
            .locale('es')
            .format('DD [de] MMMM [de] YYYY [a las] HH:mm');
          setText(parse(note.text));
          setCreatedAt(localDate);
        } else {
          console.log(data);
          showAlert('Error al obtener la nota: ' + data.message, 'warning');
        }
      } catch (error) {
        console.log('Error viewing note: ' + error.message);
        showAlert('Error al obtener la nota: ' + error.message, 'warning');
      }
    }
    fetchNote();
  }, []);

  function showImage(imageName) {
    return 'http://localhost:8080/' + imageName;
  }

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

  const handleConfirmDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/note/${id}`, {
        'Content-Type': 'multipart/form-data',
        headers: {
          Authorization: token,
        },
        method: 'DELETE',
      });
      showSuccess('Nota eliminada satisfactoriamente');
      navigate('/noteslist');
    } catch (error) {
      showAlert('Error al eliminar la nota: ' + error.message, 'warning');
    }
  };

  return (
    <div className="note">
      <h1>{note.title}</h1>
      {note.category_id && <h3>Categoria: {note.categoryTitle}</h3>}
      {note.email && <div className="by">Por {note.email}</div>}
      {note.created_at && (
        <div className="created-time">Creado el {createdAt}</div>
      )}
      {note.image && <img src={showImage(note.image)} alt={note.title} />}
      <div>{text}</div>

      <Link onClick={() => confirmDelete(note.id)} className="btn btn-danger">
        <i className="fa-solid fa-trash"></i> Eliminar Nota
      </Link>
    </div>
  );
};
export default NoteView;
