import { Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import './App.css';
import { ThemeProvider } from './ThemeContext';
import Header from './components/header/Header';
import Footer from './components/Footer/footer';
import Menu from './components/main/menu';
import Content from './Content';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<menu />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Menu />
      <Content />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
