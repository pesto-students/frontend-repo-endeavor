import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Button from './Button';
import { userTypeToPageMenuOptions } from '../constants/userTypeToPageMenuOptions';

const NavMenu = ({ userType, page }) => {
    const { handleLogout } = useContext(AuthContext);

    const menuHandler = {
        save: {
            onClickHandler: null,
        },
        delete: {
            onClickHandler: null,
        },
        add: {
            onClickHandler: null,
        },
        // next: {
        //     onClickHandler: null,
        // },
        // back: {
        //     onClickHandler: null,
        // },
        exit: {
            onClickHandler: handleLogout,
        },
    };

    const menuOptions = userTypeToPageMenuOptions[userType]?.[page] || [];

    const menu = menuOptions.map((menuDetail) => (
        <Button key={menuDetail.name} onClickHandler={menuHandler[menuDetail.name].onClickHandler}>{menuDetail.symbol}</Button>
    ));

    return <div className="menu">{menu}</div>;
};

export default NavMenu;