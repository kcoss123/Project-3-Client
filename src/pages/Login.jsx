import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/authService";

function LoginPage() {
  const [thisUser, setThisUser] = useState({
    username: "", // Changed to use 'username' instead of 'identifier'
    password: "",
    registrationType: "user"
  });
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    console.log("Text changed:", e.target.value);
    setThisUser({ ...thisUser, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting login form...");

    post("/auth/login", thisUser)
      .then((response) => {
        console.log("Login response:", response);
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
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
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M4 8a6 6 0 1112 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm6-6a1 1 0 00-1 1v1h2V3a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Don't have an account? <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
          </p>
          <p className="mt-2 text-sm">
            Returning handyman? <Link to="/handyman-login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
