import Title from '../../Title';
import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import './header.css';
import Menu from '../../components/main/menu';

function Header() {
  const [token, setToken] = useToken();
  return (
    <header>
      <NavLink to='/'>
        <Title />
      </NavLink>

      {token && (
        <div className='userLogeado'>
          <p className='msgLogueado'> Has iniciado sesión en AppNotas</p>
          <NavLink to='/'>
            <div className='button' onClick={() => setToken(null)}>
              <p>Cerrar Sesión</p>
            </div>
          </NavLink>
        </div>
      )}
      <Menu />
    </header>
  );
}

export default Header;
