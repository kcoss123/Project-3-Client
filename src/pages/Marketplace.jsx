import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { post } from '../services/authService';
import { AuthContext } from '../context/auth.context';

function Marketplace() {
    const { isLoggedIn } = useContext(AuthContext);
    const [company, setCompany] = useState(localStorage.getItem("company"));
    const [redirect, setRedirect] = useState(false);
    const [jobs, setJobs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setRedirect(true);
        } else {
            async function fetchMarket() {
                try {
                    const response = await post("/jobs/marketplace", { company });
                    setJobs(response.data.jobs);
                } catch (error) {
                    console.error("Error fetching marketplace:", error);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            }
            fetchMarket();
        }
    }, [isLoggedIn, company]);

    if (loading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {jobs && jobs.length ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white shadow-md p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-2">
                                    <Link to={`/view-job/${job._id}`} className="text-blue-500 hover:underline">
                                        {job.title}
                                    </Link>
                                </h2>
                                <p className="text-gray-700">{job.description}</p>
                                <p className="text-sm text-gray-500 mt-2">Last updated at: {job.updatedAt}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg text-gray-700">No jobs in the marketplace.</p>
                )}
            </div>
        </div>
    );
}

export default Marketplace;
