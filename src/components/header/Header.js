import Title from '../../Title';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header>
      <NavLink to="/">
        <Title />
      </NavLink>
    </header>
  );
}

export default Header;
