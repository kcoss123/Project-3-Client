import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { post } from '../services/authService';

const DeleteWorkOrder = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);
    const username = localStorage.getItem("username");

    useEffect(() => {
        const deleteWorkOrder = async () => {
            setLoading(true);
            try {
                await post("workorders/deleteworkorder", { username, orderId: params.orderId });
                setRedirect(true);
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        };

        deleteWorkOrder();
    }, [params.orderId, username]);

    if (!loading && redirect) {
        return <Navigate push to="/dashboard" />;
    }

    return null;
};

export default DeleteWorkOrder;