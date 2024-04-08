import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { post } from '../services/authService';

const DeleteJob = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const username = localStorage.getItem("username");

    useEffect(() => {
        const deleteJob = async () => {
            try {
                await post("/jobs/deletejob", { username, jobid: jobId });
                setRedirect(true);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        deleteJob();
    }, [username, jobId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error occurred while deleting job.</div>;
    }

    if (redirect) {
        return <Navigate push to="/dashboard" />;
    }

    return null; // or any default content if needed
};

export default DeleteJob;
