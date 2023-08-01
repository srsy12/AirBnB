import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './ProfileButton.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const ulClassName = `profile-dropdown ${showMenu ? "" : "hidden"}`; // Updated class name here

    return (
        <div className="header">
            <div className="header-right">
                {/* ProfileButton */}
                <button onClick={openMenu}>
                    <i className="fas fa-user-circle" />
                </button>
                {showMenu && ( // Conditionally render the logout button inside the dropdown
                    <ul className={ulClassName} ref={ulRef}>
                        <li>{user.username}</li>
                        <li>{user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <NavLink to={`/spots/current`} >
                            Manage Spots
                        </NavLink>
                        <li>
                            <button onClick={logout}>Log Out</button>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
