import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getLoginDetails, isLoggedIn } from '../../utils/authentication.js'
import { removeAuthToken } from '../../utils/localstorage.js';
import NotLoggedinNavbar from './NotLoggedInNavbar.jsx';
import TicketChekerNavbar from './TicketCheckerNavbar.jsx';
import UserNavbar from './UserNavbar.jsx';
import AdminNavbar from './AdminNavbar.jsx';

const Navbar = () => {
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [loginDetails, setLoginDetails] = useState(getLoginDetails());

    const navigate = useNavigate();

    function logoutUser() {
        // Remove the token from local storage
        removeAuthToken();

        setIsLoggedin(false);

        // Redirect to home page
        navigate('/', { replace: true });
    }

    useEffect(() => {
        setIsLoggedin(isLoggedIn())
        if (isLoggedIn()) {
            setLoginDetails(getLoginDetails())
        }
    }, [])


    return (
        <>
            {
                isLoggedin ?
                    <>
                        {
                            (loginDetails.role === 'user') &&
                            <UserNavbar isLoggedin={isLoggedin} loginDetails={loginDetails} logoutUser={logoutUser} />
                        }

                        {
                            (loginDetails.role === 'checker') &&
                            <TicketChekerNavbar isLoggedin={isLoggedin} loginDetails={loginDetails} logoutUser={logoutUser} />
                        }

                        {
                            (loginDetails.role === 'admin') &&
                            <AdminNavbar isLoggedin={isLoggedin} loginDetails={loginDetails} logoutUser={logoutUser} />
                        }
                    </>
                    :
                    <NotLoggedinNavbar isLoggedin={isLoggedin} loginDetails={loginDetails} logoutUser={logoutUser} />
            }
        </>
    )
}

export default Navbar