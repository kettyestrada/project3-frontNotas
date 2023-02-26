import React from 'react';
import './Note.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';

import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';

function CreateNote() {
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [photo, setPhoto] = useState(null);

  const [text, setText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    //Solo solicita las categorias si el usuario está logueado.
    if (token) {
      fetchCategories();
    }
  }, []);

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
      console.log(error);
      showAlert('Error al obtener las categorias: ' + error.message, 'warning');
    }
  }

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

    const title = e.target.title.value;
    const category = e.target.category.value;
    const isPublic = e.target.public.value;

    formData.append('title', title);
    formData.append('text', text);
    formData.append('isPublic', isPublic);

    if (photo) {
      formData.append('file', photo);
    }

    if (category !== '0') {
      formData.append('idCategory', category);
    }

    try {
      const resp = await fetch('http://localhost:8080/note', {
        'Content-Type': 'multipart/form-data',
        headers: {
          Authorization: token,
        },
        method: 'POST',
        body: formData,
      });

      if (resp.status === 201) {
        showSuccess('Nota creada satisfactoriamente');
        navigate('/noteslist');
      } else {
        const data = await resp.json();
        console.log(data);
        showAlert('Error al crear una nota: ' + data.message, 'warning');
      }
    } catch (error) {
      showAlert('Error al crear una nota: ' + error.message, 'warning');
    }
  };
  if (!token) return <Navigate to="/" />;

  return (
    <>
      <main>
        <div className="note">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-75">
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Escribe aquí tú título..."
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-25">
                <label htmlFor="category">Categoria</label>
              </div>
              <div className="col-75">
                <select id="category" name="category">
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
            <div className="row">
              <div className="text-note">
                <ReactQuill
                  id="text"
                  name="text"
                  placeholder="Escribe el texto de tú nota aquí.."
                  maxLength={3000}
                  value={text}
                  onChange={setText}
                  required
                ></ReactQuill>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label htmlFor="isPublic">Es pública?</label>
              </div>
              <div className="col-75">
                <input type="radio" id="public" name="is_public" value="true" />
                <label htmlFor="html">Si</label>
                <input
                  type="radio"
                  id="public"
                  name="is_public"
                  value="false"
                  defaultChecked
                />
                <label htmlFor="html">No</label>
              </div>
            </div>
            {!photo && (
              <Dropzone onDrop={handleFileDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dropzone">
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
                width="200"
                height="auto"
                alt="Imagen seleccionada"
              />
            )}

            <div className="row">
              <input type="submit" value="Crear" />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default CreateNote;
