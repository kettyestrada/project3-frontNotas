import { Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import './App.css';
import { ThemeProvider } from './ThemeContext';
import Header from './components/header/Header';
import Footer from './components/Footer/footer';
import Menu from './components/main/menu';
import Content from './Content';
import CreateNote from './CreateNote';
import { BrowserRouter, Link } from 'react-router-dom';
import NotesList from './NotesList';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <nav>
        <ul>
          <li>
            <Link to='/createnote'>create note</Link>
          </li>
          <li>
            <Link to='/noteslist'>List notes</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/' element={<menu />} />
        <Route path='/createnote' element={<CreateNote />} />
        <Route path='/noteslist' element={<NotesList />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Menu />
      <Content />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
