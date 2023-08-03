import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../Modal/Modal';
import LoginFormPage from '../LoginFormPage';
import SignupFormPage from "../SignupFormPage";
import { NavLink, useHistory } from "react-router-dom";
import './ProfileButton.css'

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const history = useHistory()
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

    const closeMenu = () => setShowMenu(false)
    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu()
        history.push('/')
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className="header">
            <div className="header-right">
                <button id="profile-button" onClick={openMenu}>
                    <i className="fas fa-user-circle" />
                </button>
            </div>
            <div>
                <ul className={ulClassName} ref={ulRef}>
                    {user ? (
                        <div className="menucontainer">
                            <li>Hello, {user.username}</li>
                            <li>{user.email}</li>
                            <button onClick={() => history.push(`/spots/current`)}>Manage Spots</button>
                            <li>
                                <button onClick={logout}>Log Out</button>
                            </li>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <OpenModalButton
                                    buttonName="Log In"
                                    modalComponent={<LoginFormPage />}
                                />
                            </div>
                            <div>
                                <OpenModalButton
                                    buttonName="Sign Up"
                                    modalComponent={<SignupFormPage />}
                                />
                            </div>
                        </div>

                    )}
                </ul>
            </div>
        </div>
    );
}

export default ProfileButton;
