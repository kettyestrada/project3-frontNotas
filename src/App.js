import './App.css';
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Content from './Content';
import CreateNote from './CreateNote';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ListNotes } from './ListNotes';

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider>
          <Header />
          <nav>
            <ul>
              <li>
                <Link to='/createnote'>create note</Link>
              </li>
              <li>
                <Link to='/listnotes'>List notes</Link>
              </li>
            </ul>
          </nav>
          <Content />
          <Routes>
            <Route path='/createnote' element={<CreateNote />} />
            <Route path='/listnotes' element={<ListNotes />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
