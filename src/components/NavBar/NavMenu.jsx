import { useContext } from 'react';
import styles from './NavBar.module.css';
import { AppContext } from '../../contexts/AppContext';
import SaveIcon from '@mui/icons-material/Save';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LogoutIcon from '@mui/icons-material/Logout';

const iconMap = {
    'Save': SaveIcon,
    'Update': UpgradeIcon,
    'Delete': DeleteIcon,
    'New': AddBusinessIcon,
    'Next': NavigateNextIcon,
    'Back': NavigateBeforeIcon,
    'Logout': LogoutIcon,
}

const DynamicIcon = ({ iconType, onClick }) => {
    const IconComponent = iconMap[iconType];

    if (!IconComponent) {
        return null; // Or return a default icon or error message
    }

    return <IconComponent onClick={onClick} />;
};

const NavMenu = () => {
    const { currentMenuConfig } = useContext(AppContext);

    return (
        <div className={styles.menu} >
            {currentMenuConfig.map((item, index) => (
                <DynamicIcon key={index} iconType={item.label} onClick={item.handler || (() => { })} />
            ))}
        </div>
    );
};

export default NavMenu;