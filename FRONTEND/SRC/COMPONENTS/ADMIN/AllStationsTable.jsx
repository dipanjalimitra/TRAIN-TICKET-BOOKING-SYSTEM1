import React, { useLayoutEffect } from 'react'
import DataTable from 'datatables.net-bs5';
import 'datatables.net-fixedheader-bs5';
import '../../styles/DataTable.css'

const AllStationsTable = ({ allStations }) => {

    useLayoutEffect(() => {
        let table = new DataTable('#stationTable', {
            fixedHeader: true,
            responsive: true,
            autoWidth: true,
            paging: true,
            orderMulti: true,
            columnDefs: [
                { orderable: false, targets: [6, 4] }
            ],
        });

        return () => {
            table.destroy();
        }
    }, [])


    return (
        <>
            <section className="d-flex flex-column justify-content-between align-items-center mt-2 w-100">
                <h3>All stations</h3>

                <div className="overflow-x-auto w-100">
                    <table id="stationTable" className="table table-striped table-bordered w-100" style={{ "width": "100%" }}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Station Code</th>
                                <th scope="col">Location</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Updated At</th>
                                <th scope='col'>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                allStations.map((station, index) => {
                                    const status = station.isActive === true ? "Active" : "Inactive";
                                    const statusColor = station.isActive === true ? "success" : "danger";
                                    const lastEditedAt = new Date(station.lastEditedAt).toLocaleString();

                                    return <tr key={station.code}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{station.name}</td>
                                        <td>{station.code}</td>
                                        <td>
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.long}`} className="link-primary" target="_blank" rel="noreferrer">
                                                {station.lat}, {station.long}
                                            </a>
                                        </td>
                                        <td>
                                            <span className={`badge bg-${statusColor}`}>{status}</span>
                                        </td>
                                        <td>{lastEditedAt}</td>
                                        <td>
                                            <button className="btn btn-sm btn-primary me-2">Edit</button>
                                            <button className="btn btn-sm btn-danger">Delete</button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </section>

        </>
    )
}

export default AllStationsTable