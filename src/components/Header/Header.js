import './Header.css';
import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import Menu from '../Menu/Menu';

function Header() {
  const [token, setToken] = useToken();
  return (
    <header>
      <div className='titleUser'>
        <NavLink className='titleApp' to='/'>
          <h1>AppNotas</h1>
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
      </div>
      <Menu />
    </header>
  );
}

export default Header;
