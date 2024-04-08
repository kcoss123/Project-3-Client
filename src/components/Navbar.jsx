import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Navbar = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);

  return (
    <nav className="bg-dark">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link className="text-white text-xl font-semibold" to="/">
          Handyman
        </Link>
        <button
          className="text-white text-xl focus:outline-none md:hidden"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="hidden md:flex space-x-4 items-center">
          <Link className="text-white" to="/">Home</Link>
          {isLoggedIn ? (
            <>
              {user.registrationType === "user" && (
                <>
                  <Link className="text-white" to="/dashboard">Dashboard</Link>
                  <Link className="text-white" to="/marketplace">Marketplace</Link>
                  <Link className="text-white" to="/create-job">Create Job</Link>
                  <Link className="text-white" to="/inbox">Inbox</Link>
                  <Link className="text-white" to="/profile">Profile</Link>
                </>
              )}
              {user.registrationType === "company" && (
                <>
                  <Link className="text-white" to="/handymandashboard">Handyman Dashboard</Link>
                  <Link className="text-white" to="/request-workorder/:handle">New Work Order</Link>
                  <Link className="text-white" to="/inbox">Inbox</Link>
                  <Link className="text-white" to="/profile/:handle">Company Profile</Link>
                </>
              )}
              <button className="text-white" onClick={logOutUser} style={{ fontSize: "1rem" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-white" to="/register">Register</Link>
              <Link className="text-white" to="/login">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
