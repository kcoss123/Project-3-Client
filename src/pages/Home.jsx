import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { post } from '../services/authService';

class Home extends Component {
    state = {
        username: localStorage.getItem("username"),
        company: localStorage.getItem("company"),
        results: null,
        location: "none",
        locDetails: "",
        validated: false,
        category: "none",
        serviceSearch: "",
        locationDropdownOpen: false,
        categoryDropdownOpen: false
    };

    validateLocDetails = () => {
        const { location, locDetails, category } = this.state;
        const isLocationValid = location !== "none";
        const isLocDetailsValid = (location === "zip" && !isNaN(locDetails) && locDetails.length === 5) || (location === "city" || location === "state");
    
        if (isLocationValid || category !== "none" || this.state.serviceSearch !== "") {
            this.setState({ validated: true });
        } else {
            this.setState({ validated: false });
        }
    };    

    handleDropdownChange = (type, value) => {
        this.setState({ [type]: value });
    };

    handleServiceInputChange = (e) => {
        this.setState({ serviceSearch: e.target.value });
    };

    toggleLocationDropdown = () => {
        this.setState(prevState => ({
            locationDropdownOpen: !prevState.locationDropdownOpen
        }));
    };

    toggleCategoryDropdown = () => {
        this.setState(prevState => ({
            categoryDropdownOpen: !prevState.categoryDropdownOpen
        }));
    };

    closeDropdowns = () => {
        this.setState({
            locationDropdownOpen: false,
            categoryDropdownOpen: false
        });
    };

    fetchList = async (e) => {
        e.preventDefault();
        this.validateLocDetails();
        if (this.state.validated) {
            try {
                const results = await post("/list/list", this.state);
                this.setState({ results });
                this.closeDropdowns();
            } catch (error) {
                console.error("Error fetching list:", error);
                this.setState({ results: [], validated: false });
            }
        }
    };

    render() {
        const { location, locDetails, category, results, company, serviceSearch } = this.state;
        const hasResults = results && results.length > 0;

        if (company) {
            return <Navigate push to={{ pathname: "/dashboard" }} />;
        }

        return (
            <div className="home text-center">
                <div className="dashboard">
                    <h1 className="text-4xl font-bold mb-8">Search for Handyman</h1>
                    <div className="listing container mx-auto">
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-4 border rounded-lg px-4">
                                <input type="text" className="form-control border rounded-md py-2 px-4" onChange={(e) => this.setState({ locDetails: e.target.value })} placeholder={`Search by Location Type`} aria-label="Search" />
                                <div className="relative">
                                    <button className="btn btn-outline-secondary border rounded-md py-2 px-4" onClick={this.toggleLocationDropdown} style={{ backgroundColor: '#F0F0F0' }}>
                                        {location[0].toUpperCase() + location.slice(1)}
                                    </button>
                                    {this.state.locationDropdownOpen && (
                                        <ul className="dropdown-menu absolute right-0 mt-2 bg-white border border-gray-300 rounded-md" style={{ backgroundColor: '#FFFFFF' }}>
                                            <li><button id="none" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("location", "none"); this.closeDropdowns(); }}>None</button></li>
                                            <li><button id="zip" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("location", "zip"); this.closeDropdowns(); }}>Zipcode</button></li>
                                            <li><button id="city" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("location", "city"); this.closeDropdowns(); }}>City</button></li>
                                            <li><button id="state" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("location", "state"); this.closeDropdowns(); }}>State</button></li>
                                        </ul>
                                    )}
                                </div>
                                <input type="text" className="form-control border rounded-md py-2 px-4" onChange={this.handleServiceInputChange} value={serviceSearch} placeholder="Search by Service Type" aria-label="Search" />
                                <div className="relative">
                                    <button className="btn btn-outline-secondary border rounded-md py-2 px-4" onClick={this.toggleCategoryDropdown} style={{ backgroundColor: '#F0F0F0' }}>
                                        {category[0].toUpperCase() + category.slice(1)}
                                    </button>
                                    {this.state.categoryDropdownOpen && (
                                        <ul className="dropdown-menu absolute right-0 mt-2 bg-white border border-gray-300 rounded-md" style={{ backgroundColor: '#FFFFFF' }}>
                                            <li><button id="none" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("category", "none"); this.closeDropdowns(); }}>None</button></li>
                                            <li><button id="all" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("category", "all"); this.closeDropdowns(); }}>All</button></li>
                                            <li><button id="electricians" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("category", "electricians"); this.closeDropdowns(); }}>Electricians</button></li>
                                            <li><button id="plumbers" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("category", "plumbers"); this.closeDropdowns(); }}>Plumbers</button></li>
                                            <li><button id="woodworkers" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("category", "woodworkers"); this.closeDropdowns(); }}>Woodworkers</button></li>
                                            <li><button id="maintenance" className="dropdown-item" onClick={(e) => { this.handleDropdownChange("category", "maintenance"); this.closeDropdowns(); }}>Maintenance</button></li>
                                        </ul>
                                    )}
                                </div>
                                <button className="btn border rounded-md py-2 px-4" onClick={this.fetchList} style={{ backgroundColor: '#007BFF', color: '#FFFFFF' }}>Search</button>
                            </div>
                        </div>
                        {results !== null && (
                            <div>
                                <br />
                                {hasResults ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((entry) => (
                                                <tr key={entry._id}>
                                                    <th scope="row"><Link to={`/profile/${entry.username}`}>{entry.companyName}</Link></th>
                                                    <td>{`${entry.street}, ${entry.unit ? `${entry.unit}, ` : ``}${entry.city}, ${entry.state}`}</td>
                                                    <td>{entry.email}</td>
                                                    <td>{entry.phone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No results found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
