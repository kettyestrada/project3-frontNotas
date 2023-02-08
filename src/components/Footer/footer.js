import { useContext } from 'react';
import { ThemeContext } from '../../ThemeContext';

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(!theme)}>{theme ? '🌞' : '🌙'}</button>
  );
}

export default ThemeSwitcher;
