import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import './menu.css';

const Menu = () => {
  const [token, setToken] = useToken();
  if (!token) return <Navigate to="/login" />;
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
            <NavLink to="/CategoryList">Gestionar Categorias</NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Menu;
