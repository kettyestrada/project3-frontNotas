import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';

const Menu = () => {
  const [token, setToken] = useToken();
  return (
    <main>
      <nav>
        {/** Menú para usuarios logueados */}
        {token && (
          <ul>
            <li>
              <NavLink to="/createnote">create note</NavLink>
            </li>
            <li>
              <NavLink to="/noteslist">List notes</NavLink>
            </li>
            <li>
              <NavLink to="/createCategory"> Crear Categoria </NavLink>
            </li>
            <li>
              <NavLink to="/CategoryList"> Categorias </NavLink>
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
    </main>
  );
};

export default Menu;
