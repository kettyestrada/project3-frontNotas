import React from 'react';

import Dropzone from 'react-dropzone';

import { useState } from 'react';
import { useToken } from '../../TokenContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { showAlert, showSuccess } from '../../functions';
import './Note.css';

export const CreateNote = ({ categories }) => {
    const [token] = useToken();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    //Creo una lista nueva de categorias donde le agrego un registro para el manejo del sin categoria
    const categoriesList = [{ id: '0', title: 'Sin categoria' }, ...categories];
    const [idCategory, setIdCategory] = useState(categoriesList[0].id);
    const [isPublic, setIsPublic] = useState('0');
    const [photo, setPhoto] = useState(null);

    //No permite visualizar esta pantalla si el usuario no está logueado
    if (!token) return <Navigate to='/' />;

    // si el tamaño del array es mayor a cero, quiere decir que hay un elemento
    //se revisa en la primera posicion del array que tipo de archivo es, si es imagen asignamos la foto al useState.
    const handleFileDrop = (files) => {
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            setPhoto(files[0]);
        } else {
            showAlert('Solo se permite cargar imágenes', 'warning');
        }
    };

    // esta funcion captura el evento cuando doy clic al boton crear.
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Constante para enviar informacion al backend
        const formData = new FormData();

        formData.append('title', title);
        formData.append('text', text);
        formData.append('isPublic', isPublic);
        formData.append('file', photo);

        //Como la categoria es opcional, reviso si se ha seleccionado categoria de la lista y la agrego al form data
        //El valor cuando selecciono sin categoria es cero
        if (idCategory !== '0') {
            formData.append('idCategory', idCategory);
        }

        try {
            //Creo una constante llamada resp y llamo al endopoint de crear nota del backend
            const resp = await fetch('http://localhost:8080/note', {
                //El metodo es POST que es el que se usa para crear un recurso
                method: 'POST',
                //Agrego el token a la cabecera, sin el token no se puede realizar la operacion
                headers: {
                    Authorization: token,
                },
                //Envio en el body la consante formData
                body: formData,
            });

            //Si la respuesta da un codigo 201 quiere decir que se creo la nota
            if (resp.status === 201) {
                showSuccess('Nota creada satisfactoriamente');
                navigate('/noteslist');
            } else {
                //En caso de que el codigo de error (status code) sea diferente a 201, obtengo el json de respuesta para poder obtener el mensaje de error
                const data = await resp.json();
                console.log(data);
                //Muestro el popup con el error
                showAlert(
                    'Error al crear una nota: ' + data.message,
                    'warning'
                );
            }
        } catch (error) {
            //Por aca entra cuando hay error de comunicacion con el endpoint
            showAlert('Error al crear una nota: ' + error.message, 'warning');
        }
    };

    return (
        <main>
            <form className='note' onSubmit={handleSubmit}>
                <input
                    className=''
                    type='text'
                    id='title'
                    placeholder='Escribe aquí tú título...'
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                />

                <label htmlFor='category'>Categoria</label>
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

                <textarea
                    placeholder='Escribe el texto de tú nota aquí..'
                    maxLength={3000}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                ></textarea>
                <div className='radio-buttons'>
                    <label htmlFor='isPublic'>Es pública?</label>
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

                <Dropzone onDrop={handleFileDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                            <input
                                {...getInputProps()}
                                onChange={(e) => setPhoto(e.target.files[0])}
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

                <input type='submit' value='Crear' />
            </form>
        </main>
    );
};

export default CreateNote;
