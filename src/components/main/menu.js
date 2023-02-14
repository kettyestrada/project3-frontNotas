import { NavLink } from 'react-router-dom';

const Menu = () => {
  return (
    <main>
      <nav>
        <ul>
          <li>
            <NavLink to="/createnote">create note</NavLink>
          </li>
          <li>
            <NavLink to="/noteslist">List notes</NavLink>
          </li>
          <li>
            <NavLink to="/login"> Login </NavLink>
          </li>
          <li>
            <NavLink to="/register"> Registro </NavLink>
          </li>
          <li>
            <NavLink to="/createCategory"> Crear Categoria </NavLink>
          </li>
          <li>
            <NavLink to="/CategoryList"> Categorias </NavLink>
          </li>
        </ul>
      </nav>
    </main>
  );
};

export default Menu;
