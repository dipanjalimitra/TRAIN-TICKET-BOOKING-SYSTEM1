import React, { useEffect, useState } from 'react'

const AllVideoDevicesDropdown = ({ videoState, allVideoDeviceObjects, setCurrentCamera }) => {
    const [initializedCameraId, setInitializedCameraId] = useState(false)

    function changeCameraId(e) {
        const cameraId = e.target.value;
        console.log(cameraId)
        setCurrentCamera(cameraId)
    }

    useEffect(() => {
        if (allVideoDeviceObjects.length > 0 && initializedCameraId === false) {
            setCurrentCamera(allVideoDeviceObjects[0].deviceId)
            setInitializedCameraId(true);
        }
    }, [videoState])



    return (
        <>
            {
                (videoState.gotPermissions === false) ?
                    <h4>Yet to get camera permissions</h4>
                    :
                    <div>
                        <h4>All available cameras </h4>
                        <select onChange={changeCameraId} className='form-select'>
                            {
                                allVideoDeviceObjects.map((item) => {
                                    return <option value={item.deviceId} key={item.deviceId}>{item.label}</option>
                                })
                            }
                        </select>
                    </div>
            }

        </>
    )
}

export default AllVideoDevicesDropdown