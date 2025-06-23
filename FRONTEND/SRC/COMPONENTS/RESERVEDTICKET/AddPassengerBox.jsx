import React from 'react'

const AddPassengerBox = ({ i }) => {
    return (
        <div key={i} className="flex flex-col gap-4 mb-3">
            <h4 className="text-xl">Passenger {i + 1}</h4>

            {/* Create a bootstrap grid */}
            <div className="row g-3 align-items-center">
                <div className="col-12 col-md-6">
                    <label htmlFor={`name-${i}`} className="form-label">Name</label>
                    <input type="text" className="form-control" id={`name-${i}`} placeholder="name" />
                </div>

                <div className="col">
                    <label htmlFor={`age-${i}`} className="form-label">Age</label>
                    <input type="number" className="form-control" id={`age-${i}`} placeholder="age" />
                </div>

                <div className="col">
                    <label htmlFor={`gender-${i}`} className="form-label">Select Gender</label>
                    <select id={`gender-${i}`} className="form-select" defaultValue={false} >
                        <option value={false} disabled>Select</option>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                        <option value="o">Others</option>
                    </select>
                </div>

                <div className="col">
                    <label htmlFor={`berth-${i}`} className="form-label">Select Berth</label>
                    <select id={`berth-${i}`} className="form-select" defaultValue={false}>
                        <option value={false} disabled>Select</option>
                        <option value="ub">Upper</option>
                        <option value="mb">Middle</option>
                        <option value="lb">Lower</option>
                        <option value="sl">Side Lower</option>
                        <option value="su">Side Upper</option>
                    </select>
                </div>

            </div>

        </div>
    )
}

export default AddPassengerBox