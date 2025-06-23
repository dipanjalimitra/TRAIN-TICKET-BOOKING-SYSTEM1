import React, { useRef, useState } from 'react'
import CONSTANTS from '../../../CONSTANTS';
import { toast } from 'react-toastify';

const AddStationModal = () => {
    // --- State Variables --- //
    const [newStation, setNewStation] = useState({ name: "", code: "", lat: "", long: "" });
    const [modalMessage, setModalMessage] = useState({ msg: null, textColor: "", isVisible: false, timeoutValue: null })

    // --- Refs --- //
    const closeButtonRef = useRef(null);

    // --- Const Variables --- //
    const modalId = CONSTANTS.addNewStationModalId;
    const API = `${CONSTANTS.API.BASE_URL}${CONSTANTS.API.addNewStation}`;

    // --- Custom Functions --- //
    const handleChange = (e) => {
        console.log(e.target.value);
        setNewStation({ ...newStation, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(newStation);

        const name = newStation.name.trim();
        const code = newStation.code.toLowerCase().trim();
        const lat = Number(newStation.lat.trim());
        const long = Number(newStation.long.trim());

        if (isNaN(lat) || isNaN(long)) {
            showAlert("Invalid Lattitude or Longitude", "error");
            return;
        }

        if (name.length < 1 || code.length < 1 || lat.length < 1 || long.length < 1) {
            showAlert("Invalid Values", "error");
            return;
        }

        try {

            const jsonData = JSON.stringify({ name, code, lat, long });

            console.log(jsonData);
            const params = {
                method: "POST",
                body: jsonData,
                headers: {
                    "Content-Type": "application/json"
                }
            }

            let response = await fetch(API, params).then(res => res.json());
            console.log(response);

            if (response.status === "error") {
                showAlert(response.msg, "error");
                return;
            }

            showAlert(response.msg, "success");
            setNewStation({ name: "", code: "", lat: "", long: "" });

            setTimeout(() => {
                closeButtonRef.current.click();
            }, 1500);


        } catch (error) {
            showAlert("Internal Server Error", "error");
            return;
        }

    }

    const showAlert = (msg, type = "error") => {
        let textColor = "text-danger";
        if (type === "success") {
            textColor = "text-success";
        } else if (type === "info") {
            textColor = "text-primary";
        }

        setModalMessage({ msg, textColor, isVisible: true });

        setTimeout(() => {
            setModalMessage({ msg: null, textColor: "", isVisible: false });
        }, 4000);


    }

    // --- JSX --- //
    return (
        <div className="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add a new Station</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-0">
                                <label htmlFor="recipient-name" className="col-form-label">Station Name :</label>
                                <input value={newStation.name} onChange={handleChange} type="text" className="form-control" name="name" />
                            </div>
                            <div className="mb-0">
                                <label htmlFor="message-text" className="col-form-label">Unique Code :</label>
                                <input value={newStation.code} onChange={handleChange} type="text" className='form-control text-lowercase' name="code" />
                            </div>
                            <div className="mb-0">
                                <label htmlFor="message-text" className="col-form-label">Lattitude :</label>
                                <input value={newStation.lat} onChange={handleChange} type="text" className='form-control text-lowercase' name="lat" />
                            </div>
                            <div className="mb-0">
                                <label htmlFor="message-text" className="col-form-label">Longitude :</label>
                                <input value={newStation.long} onChange={handleChange} type="text" className='form-control text-lowercase' name="long" />
                            </div>
                        </form>

                        {
                            (modalMessage.isVisible !== false) &&
                            <p className={modalMessage.textColor}>{modalMessage.msg}</p>
                        }
                    </div>

                    <div className="modal-footer">
                        <button ref={closeButtonRef} type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                        <button onClick={handleSubmit} type="button" className="btn btn-success">Create Station</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStationModal