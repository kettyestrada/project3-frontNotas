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
            <NavLink to="/createnote" className="menuItem">
              Crear Nota
            </NavLink>
          </li>
          <li>
            <NavLink to="/noteslist" className="menuItem">
              Listar Notas
            </NavLink>
          </li>
          <li>
            <NavLink to="/categoryList" className="menuItem">
              Gestionar Categorias
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Menu;
