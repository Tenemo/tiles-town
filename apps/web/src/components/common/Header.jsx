import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import LoadingDots from './LoadingDots';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ loading, changeTheme, darkTheme }) => {
    return (
        <React.Fragment>
            <nav className="navbar navbar-expand-sm fixed-top">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#headerNavbar" aria-controls="headerNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="headerNavbar">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                            <NavLink to="/game" className="nav-link">
                                Flip All Tiles
                            </NavLink>
                        </li>
                        <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                            <NavLink to="/about" className="nav-link">
                                About
                            </NavLink>
                        </li>
                    </ul>
                    <div className="darkModeSwitch">
                        <span><FontAwesomeIcon icon="moon" /></span>
                        <label className="switch">
                            <input type="checkbox" onChange={changeTheme} checked={darkTheme} />
                            <span className="slider round" />
                        </label>
                    </div>
                </div>
            </nav>
            {loading && <LoadingDots className="loadingDots fixed-top" interval={100} dots={20} />}
        </React.Fragment>
    );
};

Header.propTypes = {
    loading: PropTypes.bool,
    darkTheme: PropTypes.bool,
    changeTheme: PropTypes.func.isRequired
};

export default Header;