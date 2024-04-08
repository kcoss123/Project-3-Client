import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { post } from '../services/authService';
import { AuthContext } from '../context/auth.context';

function Dashboard() {
    const { isLoggedIn, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState(null);
    const [bids, setBids] = useState(null);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setRedirect(true);
        } else {
            async function fetchData() {
                try {
                    const { username, company } = user;
                    if (username || company) {
                        const { jobs, bids } = await post("/jobs", { username, company });
                        setJobs(jobs);
                        setBids(bids);
                    }
                } catch (error) {
                    setError("Error loading data");
                } finally {
                    setIsLoading(false);
                }
            }
            fetchData();
        }
    }, [isLoggedIn, user]);

    if (isLoading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                {error && <p className="text-red-500">{error}</p>}
                {user.company ? renderCompanyDashboard(jobs, bids) : renderUserDashboard(jobs)}
            </div>
        </div>
    );
}

function renderUserDashboard(jobs) {
    return (
        <>
            <h1 className="text-3xl font-semibold mb-4">User Dashboard</h1>
            {jobs && jobs.length ? (
                <>
                    <table className="w-full border-collapse border border-gray-300">
                        {/* Table header */}
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Marketplace</th>
                                <th className="p-3 text-left">Accepted</th>
                                <th className="p-3 text-left">Completed</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id} className="border-b border-gray-300">
                                    <td className="p-3">{job.title}</td>
                                    <td className="p-3">{job.marketplace ? "Yes" : "No"}</td>
                                    <td className="p-3">{job.accepted ? "Yes" : "No"}</td>
                                    <td className="p-3">{job.completed ? "Yes" : "No"}</td>
                                    <td className="p-3">
                                        <Link className="btn btn-primary" to={`/view-job/${job._id}`}>
                                            View
                                        </Link>
                                        <Link className="btn btn-danger ml-2" to={`/delete-job/${job._id}`}>
                                            Delete
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        <Link className="btn btn-primary mr-2" to="/">
                            Search for a handyman
                        </Link>
                        <Link className="btn btn-primary" to="/create-job">
                            Create a job
                        </Link>
                    </div>
                </>
            ) : (
                <p>No jobs to display.</p>
            )}
        </>
    );
}

function renderCompanyDashboard(jobs, bids) {
    return (
        <>
            <h1 className="text-3xl font-semibold mb-4">Company Dashboard</h1>
            {/* Render Jobs */}
            {jobs && jobs.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Jobs</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        {/* Table header */}
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Marketplace</th>
                                <th className="p-3 text-left">Completed</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id} className="border-b border-gray-300">
                                    <td className="p-3">{job.title}</td>
                                    <td className="p-3">{job.marketplace ? "Yes" : "No"}</td>
                                    <td className="p-3">{job.completed ? "Yes" : "No"}</td>
                                    <td className="p-3">
                                        <Link className="btn btn-primary" to={`/view-job/${job._id}`}>
                                            View
                                        </Link>
                                        <Link className="btn btn-primary ml-2" to={`/message/${job._id}`}>
                                            Message
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Render Bids */}
            {bids && bids.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Bids</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        {/* Table header */}
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 text-left">Job Name</th>
                                <th className="p-3 text-left">Quote</th>
                                <th className="p-3 text-left">Accepted</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bids.map((bid) => (
                                <tr key={bid._id} className="border-b border-gray-300">
                                    <td className="p-3">{bid.jobName}</td>
                                    <td className="p-3">{bid.quote ? "Yes" : "No"}</td>
                                    <td className="p-3">{bid.accepted ? "Yes" : "No"}</td>
                                    <td className="p-3">
                                        <Link className="btn btn-primary" to={`/view-job/${bid.job}`}>
                                            View
                                        </Link>
                                        <Link className="btn btn-primary ml-2" to={`/message/${bid.job}`}>
                                            Message
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Links */}
            <div className="mt-4">
                <Link className="btn btn-primary mr-2" to="/marketplace">
                    Visit Marketplace
                </Link>
                <Link className="btn btn-primary" to="/inbox">
                    Check Inbox
                </Link>
            </div>
        </>
    );
}

export default Dashboard;
