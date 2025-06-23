import React, { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import AllVideoDevicesDropdown from './AllVideoDevicesDropdown';
import FlashLightButton from './FlashLightButton';
import { toast } from 'react-toastify';

const Scanner = ({ qrData, setQrData }) => {
    const codeReader = new BrowserMultiFormatReader();

    // State Variables
    const [allVideoInputDevices, setAllVideoInputDevices] = useState([])
    const [currentCameraId, setCurrentCameraId] = useState(null);
    const [videoState, setVideoState] = useState({ gotPermissions: false, cameraStarted: false, numberOfDevices: 0, errorMessage: null });
    const [qrCodeResult, setQrCodeResult] = useState(null)

    // Reference variables
    const videoElementRef = useRef(null)
    const outputBoxRef = useRef(null);

    // ---- Functions ---- //
    async function getAllAvailavleVideoInputs() {
        const allDevices = await codeReader.listVideoInputDevices();
        // console.log(allDevices);

        setAllVideoInputDevices([...allDevices]);


        setVideoState((oldState) => {
            return {
                ...oldState,
                numberOfDevices: allDevices.length
            }
        })
    }

    async function getVideoPermission() {
        const constraints = {
            video: {
                facingMode: "environment"
            },
            audio: false
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            console.log("Got camera permissions");

            setVideoState({ ...videoState, gotPermissions: true })

            getAllAvailavleVideoInputs();
        }).catch((err) => {
            console.log(err);
            toast.error("Error in getting camera permissions")
        })
    }

    async function startCamera() {
        console.log("Starting camera...")
        console.log(`Camera ID: ${currentCameraId}`);

        const videoElement = videoElementRef.current;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: currentCameraId } });
            videoElement.srcObject = stream;
            videoElement.play();

            setVideoState({ ...videoState, cameraStarted: true })

            // Start reading QR code
            await codeReader.decodeFromVideoDevice(currentCameraId,
                videoElement,
                (result, error) => {
                    console.log("Scanning for Qr Code...");
                    if (result) {
                        stopCamera();

                        console.log(result)
                        outputBoxRef.current.innerText = result.toString();
                        setQrData(result.toString());

                        codeReader.stopAsyncDecode();
                        codeReader.reset();

                    }
                    // console.log(error)
                    if (error && !(error instanceof NotFoundException)) {
                        console.log("Error in QR Code Decoder");
                        console.log(error);
                    }
                });

            console.log(videoElementRef.current.style.display)

        } catch (err) {
            console.log(err);
            alert("Error in starting camera")
        }

    }

    function stopCamera() {
        console.log("Stopping camera...")
        // codeReader.stopContinuousDecode();
        codeReader.stopAsyncDecode();
        codeReader.reset();

        setVideoState({ ...videoState, cameraStarted: false })

        const videoElement = videoElementRef.current;
        if (videoElement.srcObject === null) return;
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }


    // ----- HOOCKs ----- //

    // when the document loads
    useEffect(() => {
        // getAllAvailavleVideoInputs();

        getVideoPermission()

        console.log(`display : ${document.getElementById('videoElement').style.height}`)

        return async () => {
            await stopCamera()
            setAllVideoInputDevices([]);
            setVideoState({ gotPermissions: false, cameraStarted: false, numberOfDevices: 0, errorMessage: null })
        }
    }, [])


    // ----- JSX ----- //
    return (
        <div className='card my-2 d-flex flex-wrap flex-row gap-2 w-100 mw-100'>

            <video ref={videoElementRef} className="rounded border border-2 border-dark flex-grow-1" style={{ maxWidth: "100%", display: `${videoState.cameraStarted ? "block" : "none"}` }} id="videoElement" autoPlay />

            <div className='d-flex flex-column flex-grow-1 gap-2'>

                {/* All Video Inputs Dropdown */}
                <AllVideoDevicesDropdown
                    videoState={videoState}
                    allVideoDeviceObjects={allVideoInputDevices}
                    setCurrentCamera={setCurrentCameraId}
                />

                {/* Action Buttons */}
                <ActionButtons
                    videoState={videoState}
                    getCameraPermission={getVideoPermission}
                    startCameraFunction={startCamera}
                    stopCameraFunction={stopCamera}
                />

                <p className="text-wrap d-none" ref={outputBoxRef} id="outputBox"></p>
            </div>

        </div>
    )
}

const ActionButtons = ({ videoState, getCameraPermission, startCameraFunction, stopCameraFunction }) => {

    return (
        <>
            {
                (videoState.gotPermissions === false) ?
                    <button onClick={getCameraPermission} className="btn btn-success w-100">Get Permissions</button>
                    :
                    <div className='d-flex flex-wrap gap-1 '>
                        {
                            (videoState.cameraStarted === false) ?
                                <button onClick={startCameraFunction} className="btn btn-primary">Start Camera</button>
                                :
                                <>
                                    <button onClick={startCameraFunction} className="btn btn-warning">Change Camera</button>
                                    <button onClick={stopCameraFunction} className="btn btn-danger">Stop Camera</button>
                                </>
                        }
                    </div>
            }
        </>
    )
}

export default Scanner