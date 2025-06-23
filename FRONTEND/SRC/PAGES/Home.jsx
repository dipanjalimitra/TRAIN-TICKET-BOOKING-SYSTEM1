import { Link } from "react-router-dom"
import Navbar from "../components/Navbar/MasterNavbar.jsx"
import "../styles/Home.css"

const Home = () => {
    return (
        <div>
            <Navbar />

            <main>
                <div className="jumbotron">
                    <h1 className="display-4">Book Your Train Tickets with Ease</h1>
                    <p className="lead">Experience hassle-free train ticket booking at your fingertips.</p>
                    <Link className="btn btn-warning rounded-0 btn-lg" to="/signup" role="button">Get Started</Link>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="feature-box">
                                <div className="feature-icon">
                                    <i className="fas fa-train"></i>
                                </div>
                                <h2 className="feature-title">Search Trains</h2>
                                <p className="feature-description">Find trains for your journey based on your preferences.</p>
                                <Link className="btn btn-primary rounded-0" to="/signup" role="button">Search Trains</Link>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-box">
                                <div className="feature-icon">
                                    <i className="fas fa-ticket-alt"></i>
                                </div>
                                <h2 className="feature-title">Book Tickets</h2>
                                <p className="feature-description">Book tickets quickly and securely for your preferred train.</p>
                                <a className="btn btn-primary rounded-0" href="booking.html" role="button">Book Tickets</a>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-box">
                                <div className="feature-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <h2 className="feature-title">Manage Bookings</h2>
                                <p className="feature-description">View and manage your booked tickets with ease.</p>
                                <a className="btn btn-primary rounded-0" href="bookings.html" role="button">Manage Bookings</a>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    )
}

export default Home