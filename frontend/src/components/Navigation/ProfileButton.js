import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../Modal/Modal';
import LoginFormPage from '../LoginFormPage';
import SignupFormPage from "../SignupFormPage";
import { NavLink, useHistory } from "react-router-dom";
// import './ProfileButton.css'

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

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        history.push('/')
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    let credential = "Demo-lition";
    let password = 'password';

    return (
        <div className="header">
            <div className="header-right">

                <button id="profile-button" onClick={openMenu}>
                    <i className="fas fa-user-circle" />
                </button>
                {showMenu && (
                    <div>
                        {user ? (
                            <div className="menucontainer">
                                <ul className={ulClassName} ref={ulRef}>
                                    <li>Hello, {user.username}</li>
                                    <li>{user.email}</li>
                                    <NavLink to={`/spots/current`} >
                                        Manage Spots
                                    </NavLink>
                                    <li>
                                        <button onClick={logout}>Log Out</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <ul className={ulClassName} ref={ulRef}>
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
                                <button onClick={() => dispatch(sessionActions.login({ credential, password }))}>Log in as Demo User</button>
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
