import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/authService";

const HandymanLogin = () => {
  const navigate = useNavigate();
  const [thisUser, setThisUser] = useState({
    username: "",
    password: "",
    registrationType: "company" // Default registration type for handyman login
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleTextChange = (e) => {
    setThisUser({ ...thisUser, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    post("/auth/login", thisUser)
      .then((response) => {
        storeToken(response.data.token);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.response && error.response.data && error.response.data.message) {
          console.log("Error message:", error.response.data.message);
          setErrorMessage(error.response.data.message);
        } else {
          console.log("An unexpected error occurred. Please try again.");
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mt-10 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Handyman Login</h2>
          {errorMessage && <p className="mt-2 text-center text-sm text-red-600">{errorMessage}</p>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={thisUser.username}
                onChange={handleTextChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={thisUser.password}
                onChange={handleTextChange}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Want to register as a handyman? Contact us now!
          </p>
          <p className="mt-2 text-sm">
            Looking for handymen? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Click here</Link> to go to the customer login
          </p>
        </div>
      </div>
    </div>
  );
};

export default HandymanLogin;
