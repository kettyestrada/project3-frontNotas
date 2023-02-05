import './App.css';
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Content from './Content';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  );
}

export default App;
