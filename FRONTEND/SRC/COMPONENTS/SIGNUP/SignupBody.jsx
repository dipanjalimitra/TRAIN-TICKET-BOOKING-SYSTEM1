import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CONSTANTS from '../../../CONSTANTS';
import { saveAuthToken } from '../../utils/localstorage';

const SignupBody = () => {

    // ---- State Variables ---- //
    const [passwordVisibility, setPasswordVisibility] = useState({ isVisible: false, fieldType: "password", labelPrefix: "Show" })
    const [user, setUser] = useState({ name: '', email: '', password: '', cpassword: '' })

    
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

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(user)

        if (user.password !== user.cpassword) {
            toast.error("Paswords not matching");
            return;
        }

        if (user.name.length < 3) {
            toast.error("Name should be atleast 3 characters long");
            return;
        }

        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.createUser}`
        console.log(API);

        const body = {
            name: user.name.trim(),
            email: user.email.trim(),
            password: user.password.trim()
        }

        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            const data = await response.json()
            console.log(data)

            if (data.status === 'error') {
                toast.error(data.msg)
            } else {
                toast.success(data.msg)
                setUser({ name: '', email: '', password: '', cpassword: '' })
                toast.info(`Welcome ${data.name}!`)
                toast.info(`id: ${data.id}`)

                // Save the token in local storage
                saveAuthToken(data.token);

                // Redirect to home page afte 3 second
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 3000);
            }
        } catch (err) {
            console.error(err)
            toast.error("Internal Server Error")
        }
    }


    // ---- JSX ---- //
    return (
        <div className='container my-3'>
            <h1>Create an account</h1>

            <form className='mt-3' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className='form-label fs-5' htmlFor="nameInput">Name</label>
                    <input value={user.name} onChange={handleChange} className='form-control' type="text" name="name" id='nameInput' required />
                </div>

                <div className="mb-3">
                    <label className='form-label fs-5' htmlFor="emailInput">Email Address</label>
                    <input value={user.email} onChange={handleChange} className='form-control' type="email" name="email" id='emailInput' required />
                </div>

                <div className="mb-2">
                    <label className='form-label fs-5' htmlFor="passwordInput">Password</label>
                    <input value={user.password} onChange={handleChange} className='form-control' type={passwordVisibility.fieldType} name="password" id='passwordInput' autoComplete="new-password" enterKeyHint="next" required />
                </div>

                <div className="mb-2">
                    <label className='form-label fs-5' htmlFor="cPasswordInput">Confirm Password</label>
                    <input value={user.cpassword} onChange={handleChange} className='form-control' type={passwordVisibility.fieldType} name="cpassword" id='cPasswordInput' required />
                </div>

                <div className="mb-3 form-check fs-5">
                    <input onClick={togglePasswordVisibility} className='form-check-input' type="checkbox" id='showHidePassword' value={passwordVisibility.isVisible} />
                    <label className='form-check-label' htmlFor="showHidePassword">Show Password</label>
                </div>

                <div className='my-4 text-center'>
                    <button className='btn btn-success btn-lg' type="submit">Sign Up</button>
                </div>

            </form>

            <p className='text-center'>
                Already have an account ?&nbsp;
                <Link className=" link-underline-primary" to="/login">Login</Link>
            </p>
        </div >
    )
}

export default SignupBody