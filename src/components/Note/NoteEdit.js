import React from 'react';
import './Note.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';

const NoteEdit = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState(null);

  const [title, setTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState('');
  const [text, setText] = useState('');
  const [isPublic, setIsPublic] = useState('');
  const [noteId, setNoteId] = useState('');

  const navigate = useNavigate();
  const handleFileDrop = (files) => {
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setPhoto(files[0]);
    } else {
      showAlert('Solo se permite cargar imágenes', 'warning');
    }
  };

  useEffect(() => {
    if (token) {
      fetchNote();
      fetchCategories();
    }
  }, []);

  async function fetchNote() {
    try {
      const response = await fetch(`http://localhost:8080/note/${id}`, {
        'Content-Type': 'multipart/form-data',
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        const note = data.message;
        setTitle(note.title);
        setNoteCategory(note.category_id !== undefined ? note.category_id : 0);
        setText(note.text);
        setIsPublic(note.is_public);
        setNoteId(note.id);
      } else {
        console.log(data);
        showAlert('Error al cargar la nota: ' + data.message, 'warning');
      }
    } catch (error) {
      console.log('Error al cargar la nota: ' + error.message);
      showAlert('Error al cargar la nota: ' + error.message, 'warning');
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch('http://localhost:8080/categories', {
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      const results = [];

      if (response.status === 200) {
        data.message.forEach((value) => {
          results.push({
            key: value.id,
            value: value.title,
          });
        });
        setCategories([{ key: 0, value: 'Sin categoria' }, ...results]);
      } else {
        console.log(data);
        showAlert(
          'Error al obtener las categorias: ' + data.message,
          'warning'
        );
      }
    } catch (error) {
      showAlert('Error al obtener las categorias: ' + error.message, 'warning');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(`http://localhost:8080/note/${noteId}`, {
        headers: {
          Authorization: token,
        },
        method: 'PATCH',
        body: buildFormData(),
      });

      if (resp.status === 200) {
        showSuccess('Nota actualizada satisfactoriamente');
        navigate(`/notes/${noteId}`);
      } else {
        const data = await resp.json();
        console.log(data);
        showAlert('Error al actualizar  la nota: ' + data.message, 'warning');
      }
    } catch (error) {
      console.log(error);
      showAlert(
        'Error al intentar actualizar la nota: ' + error.message,
        'warning'
      );
    }
  };

  function buildFormData() {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('isPublic', isPublic);

    if (noteCategory !== '0') {
      formData.append('idCategory', noteCategory);
    }

    if (photo) {
      formData.append('file', photo);
    }

    return formData;
  }
  //Si no hay token, enviamos al usuario a la pantalla inicial
  if (!token) return <Navigate to='/' />;

  return (
    <>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='title'>Titulo</label>
            </div>
            <div className='col-75'>
              <input
                type='text'
                id='title'
                name='title'
                placeholder='Escribe un titulo aquí...'
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-25'>
              <label htmlFor='category'>Categoria</label>
            </div>
            <div className='col-75'>
              <select
                id='category'
                name='category'
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
              >
                {categories.map((value) => {
                  return (
                    <option key={value.key} value={value.key}>
                      {value.value}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='text'>Texto</label>
            </div>
            <div className='col-75'>
              <ReactQuill
                id='text'
                name='text'
                placeholder='Escribe el texto de tú nota aquí..'
                maxLength={3000}
                value={text}
                onChange={setText}
                required
              ></ReactQuill>
            </div>
          </div>

          <div className='row'>
            <div className='col-25'>
              <label htmlFor='isPublic'>Es pública?</label>
            </div>
            <div className='col-75'>
              <input
                type='radio'
                id='public'
                name='is_public'
                value='1'
                onChange={() => setIsPublic(1)}
                checked={isPublic === 1}
              />
              <label htmlFor='html'>Si</label>
              <input
                type='radio'
                id='public'
                name='is_public'
                value='0'
                onChange={() => setIsPublic(0)}
                checked={isPublic === 0}
              />
              <label htmlFor='html'>No</label>
            </div>
          </div>

          {!photo && (
            <Dropzone onDrop={handleFileDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className='dropzone'>
                    Arrastra una imagen aquí o haz clic para seleccionar un
                    archivo.
                  </div>
                </div>
              )}
            </Dropzone>
          )}
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              width='200'
              height='auto'
              alt='Imagen seleccionada'
            />
          )}

          <div className='row'>
            <input type='submit' value='Actualizar' />
          </div>
        </form>
      </div>
    </>
  );
};
export default NoteEdit;
