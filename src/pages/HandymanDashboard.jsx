import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { post } from '../services/authService';
import { AuthContext } from '../context/auth.context';

function HandymanDashboard() {
    const { isLoggedIn, user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [workOrders, setWorkOrders] = useState([]);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setRedirect(true);
        } else {
            async function fetchData() {
                try {
                    const { username } = user;
                    if (username) {
                        const { data } = await post("/workorders/workorders", { username });
                        setWorkOrders(data);
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
                {renderHandymanDashboard(workOrders)}
            </div>
        </div>
    );
}

function renderHandymanDashboard(workOrders) {
    return (
        <>
            <h1 className="text-3xl font-semibold mb-4">Handyman Dashboard</h1>
            {workOrders.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Client Name</th>
                            <th className="p-3 text-left">Job Title</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-300">
                                <td className="p-3">{order.clientName}</td>
                                <td className="p-3">{order.jobTitle}</td>
                                <td className="p-3">{order.status}</td>
                                <td className="p-3">
                                    <Link className="btn btn-primary" to={`/work-order/${order._id}`}>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No work orders assigned.</p>
            )}
        </>
    );
}

export default HandymanDashboard;
