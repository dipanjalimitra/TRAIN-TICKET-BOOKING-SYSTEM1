import Navbar from '../components/Navbar/MasterNavbar'
import ScanQrBody from '../components/scanQrBody'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const ScanQr = () => {
  return (
    <>
      <Navbar />
      <ToastContainer position='top-left' theme='dark' />

      <ScanQrBody />
    </>
  )
}

export default ScanQr