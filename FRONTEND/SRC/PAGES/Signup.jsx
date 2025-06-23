import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from "../components/Navbar/MasterNavbar"
import SignupBody from "../components/Signup/SignupBody"

const Signup = () => {
    return (
        <>
            <Navbar />
            <ToastContainer />
            <SignupBody />
        </>
    )
}

export default Signup