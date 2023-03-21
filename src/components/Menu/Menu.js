import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import './Menu.css';

// aqui tenemos los links de la App
const Menu = () => {
    const [token, setToken] = useToken();
    return (
        <nav>
            {token && (
                <ul className='menu'>
                    <li>
                        <NavLink to='/createnote' className='menuItem'>
                            Crear Nota
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/noteslist' className='menuItem'>
                            Listar Notas
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/categoryList' className='menuItem'>
                            Gestionar Categorias
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/'
                            className='signOff'
                            onClick={() => setToken(null)}
                        >
                            Cerrar Sesión
                        </NavLink>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default Menu;
