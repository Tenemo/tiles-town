import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactElement, ChangeEvent } from 'react';

import styles from './header.scss';

import { useSelector, useDispatch } from 'store';
import { setTheme } from 'store/app/appActions';
import { getAppTheme } from 'store/app/appSelectors';

export const Header = (): ReactElement => {
    const dispatch = useDispatch();
    const appTheme = useSelector(getAppTheme);

    const onToggleThemeClick = ({
        target: { checked },
    }: ChangeEvent<HTMLInputElement>): void => {
        dispatch(setTheme(checked ? 'dark' : 'light'));
    };

    return (
        <header className={styles.header}>
            <h1>tiles.town</h1>
            <div className={styles.darkModeSwitchGroup}>
                <FontAwesomeIcon
                    className={`${appTheme === 'dark' ? '' : styles.isActive}`}
                    icon={faSun}
                />
                <div className="form-switch form-check">
                    <input
                        checked={appTheme === 'dark'}
                        className={`form-check-input ${styles.switchInput}`}
                        onChange={onToggleThemeClick}
                        role="switch"
                        type="checkbox"
                    />
                </div>
                <FontAwesomeIcon
                    className={`${appTheme === 'dark' ? styles.isActive : ''}`}
                    icon={faMoon}
                />
            </div>
        </header>
    );
};

export default Header;
