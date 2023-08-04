import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            }
        );
    };

    let button;
    if (credential.length < 4 || password.length < 6) {
        button = <button type="submit" disabled='true' className='disabledbutton1' >Log In</button>
    } else {
        button = <button type="submit" className='workingbutton1'>Log In</button>
    }

    let demoUser = {
        credential: "Demo-lition",
        password: "password"
    }
    return (
        <div id="loginformcontainer">
            <form onSubmit={handleSubmit}>
                <h1>Log In</h1>
                {errors.credential && <p>{errors.credential}</p>}
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="loginbutton">{button}</div>
                <button id="demobutton" onClick={() => dispatch(sessionActions.login(demoUser))}>Log in as Demo User</button>
            </form>
        </div>
    );
}

export default LoginFormPage;
