import React from 'react'

const LoginDetails = ({ loginDetails, logoutUser }) => {

    const role = {
        "admin": "Admin",
        "user": "Passenger",
        "checker": "Ticket Checker",
        "driver": "Driver"
    }

    return (
        <li className="nav-item dropdown">
            <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                My Account
            </button>
            <ul className="dropdown-menu cursor-pointer" title={`User Id: ${loginDetails.id}`}>
                <li  ><span className="dropdown-item fs-5 fw-bold">{loginDetails?.name}</span></li>

                <li><span className="dropdown-item text-muted">{loginDetails?.email}</span></li>

                <li><span className="dropdown-item fst-italic" href="#">Role : {role[loginDetails?.role]}</span></li>

                <li><hr className="dropdown-divider" /></li>
                <li className="dropdown-item text-center">
                    <button onClick={logoutUser} className="btn btn-danger w-100">Log out</button>
                </li>
            </ul>
        </li >
    )
}

export default LoginDetails