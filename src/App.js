import { Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import CreateCategory from './components/Categories/CreateCategory';
import CategoryList from './components/Categories/CategoryList';
import './App.css';
import { ThemeProvider } from './ThemeContext';
import Header from './components/header/Header';
import Footer from './components/Footer/footer';
import Menu from './components/main/menu';
import Content from './Content';
import CreateNote from './CreateNote';
import { BrowserRouter, Link } from 'react-router-dom';
import NotesList from './NotesList';
import NoteView from './components/Note/NoteView';
import NoteEdit from './components/Note/NoteEdit';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<menu />} />
        <Route path="/createnote" element={<CreateNote />} />
        <Route path="/noteslist" element={<NotesList />} />
        <Route path="/notes/:id" element={<NoteView />} />
        <Route path="/notes/:id/edit" element={<NoteEdit />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createCategory" element={<CreateCategory />} />
        <Route path="/categoryList" element={<CategoryList />} />
      </Routes>
      <Menu />
    </ThemeProvider>
  );
}

export default App;
