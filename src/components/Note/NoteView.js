import React from 'react';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';

import { useState, useEffect } from 'react';
import { useToken } from '../../TokenContext';
import { useParams } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';
import './Note.css';

export const NoteView = ({ categories }) => {
    const { id } = useParams();
    const [token] = useToken();

    const [note, setNote] = useState();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const categoriesList = [{ id: '0', title: 'Sin categoria' }, ...categories];

    const [idCategory, setIdCategory] = useState('');
    const [isPublic, setIsPublic] = useState('0');
    const [photo, setPhoto] = useState(null);

    // el useEffect es para cargar los datos de la nota ya existente
    useEffect(() => {
        const fetchNote = async () => {
            try {
                // si tengo token lo envio, si no quiere decir que es un anonimo.
                const resp = token
                    ? await fetch(`http://localhost:8080/note/${id}`, {
                          headers: {
                              Authorization: token,
                          },
                      })
                    : await fetch(`http://localhost:8080/note/${id}`);

                //Envio en el body la consante formData
                const body = await resp.json();

                //Si la respuesta da un codigo 200 quiere decir que se actualizo la nota
                if (resp.status === 200) {
                    setNote(body.data.note);

                    // Actualizamos los input del formulario con la info de la nota
                    setTitle(body.data.note.title);
                    setText(body.data.note.text);
                    setIsPublic(body.data.note.is_public ? '1' : '0');
                    setIdCategory(
                        body.data.note.category_id
                            ? body.data.note.category_id
                            : '0'
                    );
                } else {
                    //En caso de que el codigo de error (status code) sea diferente a 201, obtengo el json de respuesta para poder obtener el mensaje de error
                    console.log(body);
                    showAlert(
                        'Error al obtener la nota: ' + body.message,
                        'warning'
                    );
                }
            } catch (error) {
                //Por aca entra cuando hay error de comunicacion con el endpoint
                console.log('Error viewing note: ' + error.message);
                showAlert(
                    'Error al obtener la nota: ' + error.message,
                    'warning'
                );
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

    function showImage(imageName) {
        return 'http://localhost:8080/' + imageName;
    }

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
                setPhoto(null);

                showSuccess('Nota editada satisfactoriamente');
            } else {
                console.log(body);
                showAlert(
                    'Error al editar una nota: ' + body.message,
                    'warning'
                );
            }
        } catch (error) {
            showAlert('Error al editar una nota: ' + error.message, 'warning');
        }
    };

    return (
        <main>
            <form className='note' onSubmit={handleSubmit}>
                {note && (
                    <p>
                        Creado el{' '}
                        {new Date(note.created_at).toLocaleDateString('es-ES')}
                    </p>
                )}

                <input
                    type='text'
                    id='title'
                    placeholder='Escribe aquí tú título...'
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    readOnly={note?.owner === 0}
                    required
                />

                <label htmlFor='category'>Categoria</label>

                {note?.owner === 1 ? (
                    <select
                        id='category'
                        value={idCategory}
                        onChange={(e) => setIdCategory(e.target.value)}
                        readOnly={note?.owner === 0}
                        required
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
                ) : (
                    <select readOnly>
                        <option>{note?.categoryTitle}</option>
                    </select>
                )}

                <textarea
                    placeholder='Escribe el texto de tú nota aquí..'
                    maxLength={3000}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    readOnly={note?.owner === 0}
                    required
                ></textarea>

                {note?.image && (
                    <img src={showImage(note.image)} alt={note.title} />
                )}
                {note?.owner === 1 && (
                    <div className='radio-buttons'>
                        <label htmlFor='isPublic'>Es pública?</label>

                        <input
                            type='radio'
                            name='isPublic'
                            id='public'
                            value='public'
                            readOnly={note?.owner === 0}
                            onChange={(e) => setIsPublic('1')}
                            checked={isPublic === '1'}
                        />
                        <label htmlFor='html'>Si</label>
                        <input
                            type='radio'
                            id='public'
                            name='isPublic'
                            value='private'
                            readOnly={note?.owner === 0}
                            onChange={(e) => setIsPublic('0')}
                            checked={isPublic === '0'}
                        />
                        <label htmlFor='html'>No</label>
                    </div>
                )}
                {note?.owner === 1 && (
                    <Dropzone onDrop={handleFileDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input
                                    {...getInputProps()}
                                    onChange={(e) =>
                                        setPhoto(e.target.files[0])
                                    }
                                    readOnly={note?.owner === 0}
                                />
                                <div className='dropzone'>
                                    Arrastra una imagen aquí o haz clic para
                                    seleccionar un archivo.
                                </div>
                            </div>
                        )}
                    </Dropzone>
                )}
                {photo && (
                    <img
                        src={URL.createObjectURL(photo)}
                        alt='Imagen seleccionada'
                    />
                )}

                {note?.owner === 1 && <input type='submit' value='Editar' />}
            </form>
        </main>
    );
};

export default NoteView;
