import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import withReactContent from 'sweetalert2-react-content';
import { showAlert, showSuccess } from '../../functions';
import Swal from 'sweetalert2';
import './Note.css';

function NotesList() {
    const [token] = useToken();
    const [notes, setNotes] = useState([]);

    //Solo solicita las categorias si el usuario está logueado.
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch('http://localhost:8080/note', {
                    headers: {
                        Authorization: token,
                    },
                });

                const data = await response.json();

                if (response.status === 200) {
                    setNotes(data.message);
                } else {
                    console.log(data);
                    showAlert(
                        'Error al obtener las notas: ' + data.message,
                        'warning'
                    );
                }
            } catch (error) {
                showAlert(
                    'Error al obtener las notas: ' + error.message,
                    'warning'
                );
            }
        };

        if (token) {
            fetchNotes();
        }
    }, [token]);

    const handleConfirmDelete = async (id) => {
        try {
            await fetch(`http://localhost:8080/note/${id}`, {
                'Content-Type': 'multipart/form-data',
                headers: {
                    Authorization: token,
                },
                method: 'DELETE',
            });

            // quito de la lista de notas la nota eliminada.
            const updatedNotes = notes.filter((note) => note.id !== id);
            showSuccess('Nota eliminada satisfactoriamente');
            setNotes(updatedNotes);
        } catch (error) {
            showAlert('Error al eliminar la nota: ' + error.message, 'warning');
        }
    };

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

    if (!token) return <Navigate to='/login' />;

    return (
        <main>
            <div className='note'>
                <div className='container-fluid'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th className='th-50'>Titulo</th>
                                <th className='th-250'>Categoria</th>
                                <th className='th-25'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='table-group-divider'>
                            {notes.map((note) => (
                                <tr key={note.id}>
                                    <td>{note.title}</td>
                                    <td>
                                        {note.categoryTitle
                                            ? note.categoryTitle
                                            : 'Sin Categoria'}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/notes/${note.id}`}
                                            className='btn btn-info btn-space'
                                        >
                                            <i className='fa-solid fa-eye'></i>
                                        </Link>

                                        <Link
                                            onClick={() =>
                                                confirmDelete(note.id)
                                            }
                                            className='btn btn-danger btn-space'
                                        >
                                            <i className='fa-solid fa-trash'></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

export default NotesList;
