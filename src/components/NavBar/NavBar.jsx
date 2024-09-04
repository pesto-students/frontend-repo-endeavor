import styles from './NavBar.module.css';
import logo from '../../assets/icons/logo.svg';
import NavMenu from './NavMenu';

const NavBar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo" />
            </div>
            {<NavMenu />}
        </nav>
    );
};

export default NavBar;