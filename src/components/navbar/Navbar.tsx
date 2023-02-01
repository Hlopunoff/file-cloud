import {Link} from 'react-router-dom';
import s from './navbar.module.scss';

export const Navbar = () => {
    return (
        <nav className={s['nav']}>
            <Link to="/" className={s['nav__logo']}>Cloud file</Link>
        </nav>
    );
};