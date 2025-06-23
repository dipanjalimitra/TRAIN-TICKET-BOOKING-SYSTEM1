import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CONSTANTS from '../../CONSTANTS.js';
import { toast } from 'react-toastify';
import { saveAuthToken } from '../utils/localstorage.js';

const LoginBody = () => {

    // ---- State Variables ---- //
    const [passwordVisibility, setPasswordVisibility] = useState({ isVisible: false, fieldType: "password", labelPrefix: "Show" })
    const [user, setUser] = useState({ email: '', password: '' })

    // ---- Variables ---- //
    const navigate = useNavigate();


    // ---- Custom Functions ---- //

    // Show/Hide password in the password field
    const togglePasswordVisibility = (e) => {
        const passwordField = document.getElementById("passwordInput");

        if (passwordVisibility.isVisible === true)
            setPasswordVisibility({ isVisible: false, fieldType: "password", labelPrefix: "Show" });
        else
            setPasswordVisibility({ isVisible: true, fieldType: "text", labelPrefix: "Hide" });
    }

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = user.email.trim();
        const password = user.password.trim();

        console.log(`Email: ${email}, Password: ${password}`);

        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.loginUser}`;

        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 'success') {
                console.log('Login successful');
                toast.success(data.msg);

                // Save the token in local storage
                saveAuthToken(data.token);

                // Redirect to home page afte 3 second
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 3000);
            } else {
                console.log('Login failed');
                toast.error(data.msg);
            }
        }
        catch (err) {
            console.log(err);
            toast.error('Login failed');
        }
    }

    // change state variables when input fields change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    }


    // ---- JSX ---- //
    return (
        <div className='container my-3'>
            <h1>Login</h1>

            <form className='mt-3' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className='form-label fs-5' htmlFor="emailInput">Email Address</label>
                    <input onChange={handleChange} value={user.email} className='form-control' type="email" name="email" id='emailInput' required />
                </div>

                <div className="mb-2">
                    <label className='form-label fs-5' htmlFor="passwordInput">Password</label>
                    <input onChange={handleChange} value={user.password} className='form-control' type={passwordVisibility.fieldType} name="password" id='passwordInput' required />
                </div>

                <div className="mb-3 form-check fs-5">
                    <input onClick={togglePasswordVisibility} className='form-check-input' type="checkbox" id='showHidePassword' value={passwordVisibility.isVisible} />
                    <label className='form-check-label' htmlFor="showHidePassword">{passwordVisibility.labelPrefix} Password</label>
                </div>

                <div className='my-4 text-center'>
                    <button className='btn btn-success btn-lg' type="submit">Login</button>
                </div>

            </form>

            <p className='text-center'>
                Don't have an account ?&nbsp;
                <Link className=" link-underline-primary" to="/signup">Signup</Link>
            </p>


        </div >


    )
}

export default LoginBody