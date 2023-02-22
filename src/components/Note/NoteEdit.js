import React from 'react';
import './Note.css';
import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';

const NoteEdit = () => {
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [isPublic, setIsPublic] = useState('');
  const [image, setImage] = useState('');
  const [noteId, setNoteId] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    //Solo solicita las categorias si el usuario está logueado.
    if (token) {
      async function fetchNote() {
        try {
          const resp = await fetch(`http://localhost:8080/note/${id}`, {
            headers: {
              Authorization: token,
            },
          });

          const data = await resp.json();

          if (resp.status === 200) {
            const note = data.message;
            setTitle(note.title);
            setCategory(note.category !== undefined ? note.category : 0);
            setText(note.text);
            setIsPublic(note.is_public);
            setImage(note.image);
            setNoteId(note.id);
          } else {
            console.log(data);
            setError('Error al cargar la nota: ' + data.message);
          }
        } catch (error) {
          console.log('Error al cargar la nota: ' + error.message);
          setError('Error al cargar la nota: ' + error.message);
        }
      }
      fetchNote();
      fetchCategories();
    }
  }, []);

  async function fetchCategories() {
    try {
      const resp = await fetch('http://localhost:8080/categories', {
        headers: {
          Authorization: token,
        },
      });

      const data = await resp.json();
      const results = [];

      if (resp.status === 200) {
        data.message.forEach((value) => {
          results.push({
            key: value.id,
            value: value.title,
          });
        });
        setCategories([{ key: '0', value: 'Sin categoria' }, ...results]);
      } else {
        console.log(data);
        setError('Error al obtener las categorias: ' + data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      setError('Error al obtener las categorias: ' + error.message);
      setSuccess('');
    }
  }

  function showImage(imageName) {
    return 'http://localhost:8080/' + imageName;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('isPublic', isPublic);

    /*if (imageUploaded) {
      formData.append('file', file);
    }*/

    if (category !== 0) {
      formData.append('idCategory', category);
    }

    console.log('data: ' + category);

    try {
      const resp = await fetch(`http://localhost:8080/note/${noteId}`, {
        headers: {
          Authorization: token,
        },
        method: 'PATCH',
        body: formData,
      });

      if (resp.status === 200) {
        navigate(`/notes/${noteId}`);
      } else {
        const data = await resp.json();
        console.log(data);
        setError('Error al actualizar  la nota: ' + data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      setError('Error al cargar la nota: ' + error.message);
      setSuccess('');
    }
  };
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <textarea
                id='text'
                name='text'
                placeholder='Escribe el texto de tú nota aquí..'
                maxLength={280}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
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
          <div className='error'>{error}</div>
          <div className='success'>{success}</div>
          <div className='row'>
            <input type='submit' value='Actualizar' />
          </div>
        </form>
      </div>
    </>
  );
};
export default NoteEdit;
