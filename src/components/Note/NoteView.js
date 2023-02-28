import React from 'react';
import './Note.css';

import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';

import { useState, useEffect } from 'react';
import { useToken } from '../../TokenContext';
import { useNavigate, useParams } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';

function NoteView({ categories }) {
  const { id } = useParams();
  const [token] = useToken();
  const navigate = useNavigate();

  const [note, setNote] = useState();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const [isPublic, setIsPublic] = useState('0');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const resp = token
          ? await fetch(`http://localhost:8080/note/${id}`, {
              headers: {
                Authorization: token,
              },
            })
          : await fetch(`http://localhost:8080/note/${id}`);

        const body = await resp.json();

        if (resp.status === 200) {
          setNote(body.data.note);

          // Actualizamos los input del formulario con la info de la nota
          setTitle(body.data.note.title);
          setText(body.data.note.text);
          setIsPublic(body.data.note.is_public ? '1' : '0');
          setIdCategory(body.data.note.category_id);
        } else {
          console.log(body);
          showAlert('Error al obtener la nota: ' + body.message, 'warning');
        }
      } catch (error) {
        console.log('Error viewing note: ' + error.message);
        showAlert('Error al obtener la nota: ' + error.message, 'warning');
      }
    };

    fetchNote();
  }, [id, token]);

  const handleFileDrop = (files) => {
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setPhoto(files[0]);
    } else {
      showAlert('Solo se permite cargar imágenes', 'warning');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('title', title);
    formData.append('text', text);
    formData.append('idCategory', Number(idCategory));
    formData.append('isPublic', isPublic);
    formData.append('file', photo);

    try {
      const res = await fetch(`http://localhost:8080/note/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const body = await res.json();

      if (res.status === 200) {
        setNote({
          ...note,
          title: body.data.note.title,
          category_id: body.data.note.category_id,
          is_public: body.data.note.is_public,
          text: body.data.note.text,
          image: body.data.note.image,
        });

        showSuccess('Nota creada satisfactoriamente');
      } else {
        console.log(body);
        showAlert('Error al crear una nota: ' + body.message, 'warning');
      }
    } catch (error) {
      showAlert('Error al crear una nota: ' + error.message, 'warning');
    }
  };

  return (
    <main>
      <div className="note">
        {note && <p>{new Date(note.created_at).toLocaleDateString('es-ES')}</p>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-75">
              <input
                type="text"
                id="title"
                placeholder="Escribe aquí tú título..."
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                readOnly={note?.owner === 0}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label htmlFor="category">Categoria</label>
            </div>
            <div className="col-75">
              {note?.owner === 1 ? (
                <select
                  id="category"
                  value={idCategory}
                  onChange={(e) => setIdCategory(e.target.value)}
                  readOnly={note?.owner === 0}
                  required
                >
                  {categories.map((currentCategory) => {
                    return (
                      <option
                        key={currentCategory.id}
                        value={currentCategory.id}
                      >
                        {currentCategory.title}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <select readOnly>
                  <option>{note?.categoryTitle}</option>
                </select>
              )}
            </div>
          </div>
          <div className="row">
            <div className="text-note">
              <textarea
                placeholder="Escribe el texto de tú nota aquí.."
                maxLength={3000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                readOnly={note?.owner === 0}
                required
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label htmlFor="isPublic">Es pública?</label>
            </div>
            <div className="col-75">
              <input
                type="radio"
                name="isPublic"
                id="public"
                value="public"
                readOnly={note?.owner === 0}
                onChange={(e) => setIsPublic('1')}
                checked={isPublic === '1'}
              />
              <label htmlFor="html">Si</label>
              <input
                type="radio"
                id="public"
                name="isPublic"
                value="private"
                readOnly={note?.owner === 0}
                onChange={(e) => setIsPublic('0')}
                checked={isPublic === '0'}
              />
              <label htmlFor="html">No</label>
            </div>
          </div>
          {note?.owner === 1 && (
            <Dropzone onDrop={handleFileDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input
                    {...getInputProps()}
                    onChange={(e) => setPhoto(e.target.files[0])}
                    readOnly={note?.owner === 0}
                  />
                  <div className="dropzone">
                    Arrastra una imagen aquí o haz clic para seleccionar un
                    archivo.
                  </div>
                </div>
              )}
            </Dropzone>
          )}
          {/* {photo && (
            <img
              src={URL.createObjectURL(photo)}
              width="200"
              height="auto"
              alt="Imagen seleccionada"
            />
          )} */}

          <div className="row">
            {note?.owner === 1 && <input type="submit" value="Editar" />}
          </div>
        </form>
      </div>
    </main>
  );
}

export default NoteView;
