import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Content() {
  const { theme } = useContext(ThemeContext);

  return (
    <article className={theme ? 'dark' : 'light'}>
      <h2>Welcome to my app</h2>
      <p></p>
    </article>
  );
}

export default Content;
