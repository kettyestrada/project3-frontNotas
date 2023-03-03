import React from 'react';
import './Note.css';

import Dropzone from 'react-dropzone';

import { useState } from 'react';
import { useToken } from '../../TokenContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';

function CreateNote({ categories }) {
    const [token] = useToken();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const categoriesList = [{ id: '0', title: 'Sin categoria' }, ...categories];
    const [idCategory, setIdCategory] = useState(categoriesList[0].id);
    const [isPublic, setIsPublic] = useState('0');
    const [photo, setPhoto] = useState(null);

    //No permite visualizar esta pantalla si el usuario no está logueado
    if (!token) return <Navigate to='/' />;

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
        formData.append('isPublic', isPublic);
        formData.append('file', photo);

        if (idCategory !== '0') {
            formData.append('idCategory', idCategory);
        }

        try {
            const resp = await fetch('http://localhost:8080/note', {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (resp.status === 201) {
                showSuccess('Nota creada satisfactoriamente');
                navigate('/noteslist');
            } else {
                const data = await resp.json();
                console.log(data);
                showAlert(
                    'Error al crear una nota: ' + data.message,
                    'warning'
                );
            }
        } catch (error) {
            showAlert('Error al crear una nota: ' + error.message, 'warning');
        }
    };

    return (
        <main>
            <div className='note'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-75'>
                            <input
                                type='text'
                                id='title'
                                placeholder='Escribe aquí tú título...'
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
                                value={idCategory}
                                onChange={(e) => setIdCategory(e.target.value)}
                            >
                                {categoriesList.map((currentCategory) => {
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
                        </div>
                    </div>
                    <div className='row'>
                        <div className='text-note'>
                            <textarea
                                placeholder='Escribe el texto de tú nota aquí..'
                                maxLength={3000}
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
                                name='isPublic'
                                value='public'
                                onChange={(e) => setIsPublic('1')}
                            />
                            <label htmlFor='html'>Si</label>
                            <input
                                type='radio'
                                id='public'
                                name='isPublic'
                                value='private'
                                onChange={(e) => setIsPublic('0')}
                                defaultChecked
                            />
                            <label htmlFor='html'>No</label>
                        </div>
                    </div>
                    <Dropzone onDrop={handleFileDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input
                                    {...getInputProps()}
                                    onChange={(e) =>
                                        setPhoto(e.target.files[0])
                                    }
                                />
                                <div className='dropzone'>
                                    Arrastra una imagen aquí o haz clic para
                                    seleccionar un archivo.
                                </div>
                            </div>
                        )}
                    </Dropzone>
                    {photo && (
                        <img
                            src={URL.createObjectURL(photo)}
                            alt='Imagen seleccionada'
                        />
                    )}

                    <div className='row'>
                        <input type='submit' value='Crear' />
                    </div>
                </form>
            </div>
        </main>
    );
}

export default CreateNote;
