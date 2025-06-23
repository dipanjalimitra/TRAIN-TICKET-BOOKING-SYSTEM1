import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';
import CONSTANTS from '../../../CONSTANTS'
import AddStationModal from '../../components/Admin/AddStationModal'
import Navbar from '../../components/Navbar/MasterNavbar'
import React, { useEffect, useRef, useState } from 'react'
import AllStationsTable from '../../components/Admin/AllStationsTable'

const ManageStations = () => {
    // --- State Variables --- //
    const [stations, setStations] = useState([])
    const [hasFetched, setHasFetched] = useState(false)

    const ref = useRef(false);

    // --- Constants --- //
    const modalId = CONSTANTS.addNewStationModalId;

    // --- Custom Functions --- //
    const fetchAllStations = async () => {
        const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.getAllStations}`

        const response = await fetch(API).then(res => res.json())

        console.log(response);


        if (response.status === "error") {
            console.log(response);
            alert(response.msg)
            return;
        }

        if (response.status === "success") {
            // console.log(response.data);

            const sortedData = response.data.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            setStations(sortedData);

            // toast.success(response.msg);
            ref.current = true;
        }
    }

    // --- Side Effects --- //
    useEffect(() => {
        if (!hasFetched) {
            fetchAllStations();
            setHasFetched(true);
        }
    }, [hasFetched])


    // --- JSX --- //
    return (
        <>
            <Navbar />
            <ToastContainer position='top-left' theme='dark' />

            <AddStationModal />

            <div className="container my-3">
                <section className="d-flex  justify-content-between align-items-center">
                    <h1>Manage stations</h1>

                    <div >
                        <button type="button" className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
                            Add Station
                        </button>
                        <button onClick={fetchAllStations} type="button" className="btn btn-warning">
                            Get All Stations
                        </button>
                    </div>
                </section>

                {
                    // console.log(stations.length)
                    (stations.length > 0) &&
                    <AllStationsTable allStations={stations} />
                }

            </div >
        </>
    )
}

export default ManageStations