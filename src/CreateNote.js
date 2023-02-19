import './App.css';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function CreateNote() {
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);

  useEffect(() => {
    //Solo solicita las categorias si el usuario está logueado.
    if (token) {
      //cargo las categorias
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
        setCategories([{ key: '0', value: 'Not Selected' }, ...results]);
      } else {
        console.log(data);
        setError('Error retrieving categories: ' + data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      setError('Error retrieving categories: ' + error.message);
      setSuccess('');
    }
  }

  const handleChanged = (e) => {
    setImageUploaded(true);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const title = e.target.title.value;
    const text = e.target.text.value;
    const category = e.target.category.value;
    const isPublic = e.target.public.value;

    formData.append('title', title);
    formData.append('text', text);
    formData.append('isPublic', isPublic);

    if (imageUploaded) {
      formData.append('file', file);
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
        e.target.reset();
        setSuccess('Note created successfully');
        setError('');
        setImageUploaded(false);
        setFile(null);
      } else {
        const data = await resp.json();
        console.log(data);
        setError('Error creating note: ' + data.message);
        setSuccess('');
      }
    } catch (error) {
      console.log(error);
      setError('Error creating note: ' + error.message);
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
              <label htmlFor='title'>Title</label>
            </div>
            <div className='col-75'>
              <input
                type='text'
                id='title'
                name='title'
                placeholder='Put your title here...'
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-25'>
              <label htmlFor='category'>Category</label>
            </div>
            <div className='col-75'>
              <select id='category' name='category'>
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
              <label htmlFor='text'>Text</label>
            </div>
            <div className='col-75'>
              <textarea
                id='text'
                name='text'
                placeholder='Write something..'
                maxLength={280}
                required
              ></textarea>
            </div>
          </div>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='file'>Select a file</label>
            </div>
            <div className='col-75'>
              <input
                type='file'
                id='file'
                name='file'
                onChange={handleChanged}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col-25'>
              <label htmlFor='isPublic'>Is public?</label>
            </div>
            <div className='col-75'>
              <input type='radio' id='public' name='is_public' value='true' />
              <label htmlFor='html'>Yes</label>
              <input
                type='radio'
                id='public'
                name='is_public'
                value='false'
                defaultChecked
              />
              <label htmlFor='html'>No</label>
            </div>
          </div>
          <div className='error'>{error}</div>
          <div className='success'>{success}</div>
          <div className='row'>
            <input type='submit' value='Submit' />
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateNote;
