import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import LoginBody from "../components/LoginBody"
import Navbar from "../components/Navbar/MasterNavbar"

const Login = () => {
    return (
        <>
            <Navbar />
            <ToastContainer position="top-left" theme="dark" />
            <LoginBody />
        </>
    )
}

export default Login