import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import * as sessionActions from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();


    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li className="nav-session-links">
                <NavLink to="/spots" className="nav-link">Create A New Spot</NavLink>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <li className="nav-session-links">
                <NavLink to="/login" className="nav-link">Log In</NavLink>
                <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
            </li>
        );
    }

    return (
        <ul className="nav-container">
            <button className="nav-logo">
                <NavLink exact to="/" className="nav-link">
                    <img className="homeLogo-png" src="https://cdn.pixabay.com/photo/2018/05/08/21/28/airbnb-3384008_1280.png" alt="airbnblogo"></img>
                </NavLink>
            </button>
            {isLoaded && sessionLinks}
        </ul>
    );
}

export default Navigation;
