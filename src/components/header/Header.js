import Title from '../../Title';
import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';

function Header() {
  const [token, setToken] = useToken();
  return (
    <header>
      <NavLink to="/">
        <Title />
        {token && (
          <div className="button" onClick={() => setToken(null)}>
            <p>Cerrar Sesión</p>
          </div>
        )}
      </NavLink>
    </header>
  );
}

export default Header;
