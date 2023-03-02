import './App.css';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToken } from './TokenContext';
import { showAlert, showSuccess } from './functions';

import Register from './components/Register/Register';
import Login from './components/Login/Login';
import CategoryList from './components/Categories/CategoryList';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import NotesList from './components/Note/NotesList';
import CreateNote from './components/Note/CreateNote';
import NoteView from './components/Note/NoteView';

function App() {
    const [token] = useToken();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const resp = await fetch('http://localhost:8080/category', {
                    headers: {
                        Authorization: token,
                    },
                });
                const data = await resp.json();

                if (resp.status === 200) {
                    setCategories(data.message);
                } else {
                    showAlert(data.message, 'warning');
                }
            } catch (error) {
                showAlert(error.message, 'warning');
            }
        };

        if (token) getCategories();
    }, [token]);

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<NotesList />} />
                <Route path='/login' element={<Login />} />
                <Route
                    path='/createnote'
                    element={<CreateNote categories={categories} />}
                />
                <Route path='/noteslist' element={<NotesList />} />
                <Route
                    path='/notes/:id'
                    element={<NoteView categories={categories} />}
                />
                <Route path='/register' element={<Register />} />
                <Route
                    path='/categoryList'
                    element={
                        <CategoryList
                            categories={categories}
                            setCategories={setCategories}
                        />
                    }
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
