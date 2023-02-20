import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';

const Menu = () => {
  const [token, setToken] = useToken();
  return (
    <nav>
      {/** Menú para usuarios logueados */}
      {token && (
        <ul>
          <li>
            <NavLink to="/createnote">Crear Nota</NavLink>
          </li>
          <li>
            <NavLink to="/noteslist">Listar Notas</NavLink>
          </li>
          <li>
            <NavLink to="/CategoryList"> Gestionar Categorias </NavLink>
          </li>
        </ul>
      )}
      {/** Menú para usuarios no logueados */}
      {!token && (
        <ul>
          <li>
            <NavLink to="/login"> Login </NavLink>
          </li>
          <li>
            <NavLink to="/register"> Registro </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Menu;
