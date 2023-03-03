import './Header.css';
import { NavLink } from 'react-router-dom';
import Menu from '../Menu/Menu';

function Header() {
    return (
        <header>
            <div className='titleUser'>
                <NavLink className='titleApp' to='/'>
                    <h1>AppNotas</h1>
                </NavLink>
            </div>
            <Menu />
        </header>
    );
}

export default Header;
