import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
    useEffect(() => {
        // Clearing localStorage when the component mounts
        localStorage.clear();
    }, []);

    return <Navigate push to={{ pathname: "/login" }} />;
};

export default Logout;