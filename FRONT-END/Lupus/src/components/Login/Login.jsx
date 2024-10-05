import React, { useState } from "react";
import styles from './Login.module.css';

function Login() {
    const [isLoginSlideUp, setIsLoginSlideUp] = useState(true); // Track login/signup state

    const handleLoginClick = () => {
        setIsLoginSlideUp(false); // Show login form
    };

    const handleSignupClick = () => {
        setIsLoginSlideUp(true); // Show signup form
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.formStructor}`}>
                <div className={`${styles.signup} ${isLoginSlideUp ? "" : styles.SlideUp}`}>
                    <h2 className={styles.formTitle} id="signup" onClick={handleSignupClick}>
                        <span>or</span>Sign up
                    </h2>
                    <div className={styles.formHolder}>
                        <input type="email" className={styles.input} placeholder="Username" />
                        <input type="password" className={styles.input} placeholder="Password" />
                    </div>
                    <button className={styles.submitBtn}>Sign up</button>
                </div>
                <div className={`${styles.login} ${!isLoginSlideUp ? "" : styles.SlideUp}`}>
                    <div className={styles.center}>
                        <h2 className={styles.formTitle} id="login" onClick={handleLoginClick}>
                            <span>or</span>Log in
                        </h2>
                        <div className={styles.formHolder}>
                            <input type="email" className={styles.input} placeholder="Username" />
                            <input type="password" className={styles.input} placeholder="Password" />
                        </div>
                        <button className={styles.submitBtn}>Log in</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;