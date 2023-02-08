import { NavLink } from 'react-router-dom';

const Menu = () => {
  return (
    <main>
      <ul>
        <li>
          <NavLink to="/login"> Login </NavLink>
        </li>
        <li>
          <NavLink to="/register"> Registro </NavLink>
        </li>
      </ul>
    </main>
  );
};

export default Menu;
