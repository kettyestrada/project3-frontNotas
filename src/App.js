import './App.css';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import CategoryList from './components/Categories/CategoryList';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import NotesList from './components/Note/NotesList';
import CreateNote from './components/Note/CreateNote';
import NoteView from './components/Note/NoteView';
import NoteEdit from './components/Note/NoteEdit';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<NotesList />} />
        <Route path='/login' element={<Login />} />
        <Route path='/createnote' element={<CreateNote />} />
        <Route path='/noteslist' element={<NotesList />} />
        <Route path='/notes/:id' element={<NoteView />} />
        <Route path='/notes/:id/edit' element={<NoteEdit />} />
        <Route path='/register' element={<Register />} />
        <Route path='/categoryList' element={<CategoryList />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
