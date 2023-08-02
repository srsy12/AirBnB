import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <ul className='nav-container'>
            <button className="nav-logo">
                <NavLink exact to="/" className="nav-link">
                    <img className="homeLogo-png" src="https://cdn.pixabay.com/photo/2018/05/08/21/28/airbnb-3384008_1280.png" alt="airbnblogo"></img>
                </NavLink>
            </button>
            {isLoaded && (
                <li className="nav-session-links">
                    {sessionUser && (<NavLink to="/spots" className="nav-link">Create A New Spot</NavLink>)}
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>
    );
}

export default Navigation;
