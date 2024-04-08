import React from "react";
import { post } from "../services/authService";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationType: "user", // Added registration type field
            firstName: "",
            lastName: "",
            companyName: "", // Added company name field
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            street: "",
            unit: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            phone: "", // Added phone field
            category: "", // Added category field
            about: "", // Added about field
            registrationSuccess: false,
            emailError: "",
            confirmPasswordError: "",
            registrationError: ""
        };
    }

    handleChange = (event) => {
        const { id, value } = event.target;
        if (id === "registrationType") {
            this.setState({ registrationType: value });
        } else {
            this.setState({ [id]: value });
            if (id === "email") {
                this.validateEmail(value);
            } else if (id === "confirmPassword") {
                this.validateConfirmPassword(value);
            }
        }
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        if (!this.validateRequiredFields()) {
            console.log("Please fill all required fields");
            return;
        }

        if (this.state.emailError !== "" || this.state.confirmPasswordError !== "") {
            console.log("Please correct any errors in email or confirm password fields");
            return;
        }

        try {
            const response = await post("/users/register", {
                registrationType: this.state.registrationType, // Updated to include registration type in the request
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                companyName: this.state.companyName,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
                street: this.state.street,
                unit: this.state.unit,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip,
                country: this.state.country,
                phone: this.state.phone,
                category: this.state.category,
                about: this.state.about
            });

            if (response.status === 201) {
                this.setState({ registrationSuccess: true });
                console.log("Registration successful");
            } else {
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || "Registration failed";
                this.setState({ registrationError: errorMessage });
                console.log("Registration failed:", errorMessage);
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (re.test(email)) {
            this.setState({ emailError: "" });
        } else {
            this.setState({ emailError: "Please enter a valid email address" });
        }
    };

    validateConfirmPassword = (confirmPassword) => {
        if (confirmPassword === this.state.password) {
            this.setState({ confirmPasswordError: "" });
        } else {
            this.setState({ confirmPasswordError: "Passwords do not match" });
        }
    };

    validateRequiredFields = () => {
        const { firstName, lastName, username, email, password, confirmPassword } = this.state;
        return firstName !== "" && lastName !== "" && username !== "" && email !== "" && password !== "" && confirmPassword !== "" && (this.state.registrationType === "user" || this.state.companyName !== "");
    };

    render() {
        return (
            <div>
                {this.state.registrationSuccess ? (
                    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                <p className="text-center text-green-500 font-bold text-lg">Registration successful</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <p className={this.state.msg ? "msg" : "hidden"}>{this.state.msg}</p>
                        <p className="text-red-500">{this.state.registrationError}</p> {/* Display registration error */}
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                <form onSubmit={this.handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="registrationType" className="block text-sm font-medium text-gray-700">
                                            Registration Type <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <select id="registrationType" value={this.state.registrationType} required className="input-field" onChange={this.handleChange}>
                                                <option value="user">Customer</option>
                                                <option value="company">Company</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input id="firstName" value={this.state.firstName} type="text" required className="input-field" placeholder="First Name" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input id="lastName" value={this.state.lastName} type="text" required className="input-field" placeholder="Last Name" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    {this.state.registrationType === "company" && (
                                        <div>
                                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                                Company Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="mt-1">
                                                <input id="companyName" value={this.state.companyName} type="text" required className="input-field" placeholder="Company Name" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input id="email" value={this.state.email} type="text" required className="input-field" placeholder="Email" onChange={this.handleChange} />
                                            {this.state.emailError && <p className="text-red-500 text-sm">{this.state.emailError}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input id="username" value={this.state.username} type="text" required className="input-field" placeholder="Username" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input id="password" value={this.state.password} type="password" required className="input-field" placeholder="Password" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input id="confirmPassword" value={this.state.confirmPassword} type="password" required className="input-field" placeholder="Confirm Password" onChange={this.handleChange} />
                                            {this.state.confirmPasswordError && <p className="text-red-500 text-sm">{this.state.confirmPasswordError}</p>}
                                        </div>
                                    </div>
                                                                    <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                                        Street Address
                                    </label>
                                    <div className="mt-1">
                                        <input id="street" value={this.state.street} type="text" className="input-field" placeholder="Street Address" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                        Unit/Apt
                                    </label>
                                    <div className="mt-1">
                                        <input id="unit" value={this.state.unit} type="text" className="input-field" placeholder="Unit/Apt" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <div className="mt-1">
                                        <input id="city" value={this.state.city} type="text" className="input-field" placeholder="City" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <div className="mt-1">
                                        <input id="state" value={this.state.state} type="text" className="input-field" placeholder="State" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                        Zipcode
                                    </label>
                                    <div className="mt-1">
                                        <input id="zip" value={this.state.zip} type="text" className="input-field" placeholder="Zipcode" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <div className="mt-1">
                                        <input id="country" value={this.state.country} type="text" className="input-field" placeholder="Country" onChange={this.handleChange} />
                                    </div>
                                </div>
                                    {this.state.registrationType === "company" && (
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone <span className="text-red-500">*</span>
                                            </label>
                                            <div className="mt-1">
                                                <input id="phone" value={this.state.phone} type="text" required className="input-field" placeholder="Phone" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    )}
                                    {this.state.registrationType === "company" && (
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <div className="mt-1">
                                                <input id="category" value={this.state.category} type="text" required className="input-field" placeholder="Category" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    )}
                                    {this.state.registrationType === "company" && (
                                        <div>
                                            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                                About
                                            </label>
                                            <div className="mt-1">
                                                <textarea id="about" value={this.state.about} className="input-field" placeholder="About" onChange={this.handleChange} />
                                            </div>
                                        </div>                                        
                                    )}
                                    <div className="col-auto">
                                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Register;
