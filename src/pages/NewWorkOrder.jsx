import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { post } from '../services/authService';

const NewWorkOrder = (props) => {
    const { handle } = useParams();
    const [state, setState] = useState({
        username: localStorage.getItem("username"),
        title: "",
        companyUsername: handle,
        companyName: null,
        desc: "",
        files: [],
        validated: false,
        error: false,
        redirect: false,
        loading: false,
    });

    const validateWorkOrder = () => {
        const { title, desc } = state;
        const isValid = title && desc;
        setState({ ...state, validated: isValid, error: !isValid });
        return isValid;
    };

    const submitWorkOrder = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", state.title);
        formData.append("companyUsername", state.companyUsername);
        formData.append("desc", state.desc);
        state.files.forEach(file => {
            formData.append("files", file);
        });

        if (validateWorkOrder()) {
            post("/workorders/addworkorder", formData) // Using post function from authService.js
                .then(() => setState({ ...state, redirect: true }))
                .catch(() => setState({ ...state, validated: true, error: true }));
        }
    };

    useEffect(() => {
        const getCompanyProfile = async () => {
            setState({ ...state, loading: true });
            try {
                const res = await post("/list/getcompanyprofile", state); // Using post function from authService.js
                setState({ ...state, companyName: res.data.company.companyName });
            } catch (error) {
                setState({ ...state, companyName: null, error: true });
            }
            setState({ ...state, loading: false });
        };
        getCompanyProfile();
    }, []);

    const { companyUsername, companyName, redirect, error, validated, loading } = state;

    if (redirect || !companyUsername) {
        return <Navigate push to={{ pathname: "/dashboard" }} />;
    }
    
    if (loading) {
        // Render a loading spinner while data is being fetched
        return (
            <div className="add-workorder">
                <div className="container text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error && !companyName) {
        return (
            <div className="add-workorder">
                <div className="container">
                    <p>Error retrieving company name</p>
                </div>
            </div>
        );
    }
    
    if (!companyName) {
        return (
            <div className="add-workorder">
                <div className="container">
                    <p>No company name found</p>
                </div>
            </div>
        );
    }
    
    if (validated && error) {
        return (
            <div className="add-workorder">
                <br />
                <div className="container">
                    <p>Database error</p>
                </div>
            </div>
        );
    }

    return (
        <div className="add-workorder">
            <br />
            <div className="container">
                {error && !validated && <p>Error: please ensure there is a title and description</p>}
                <div className="row">
                    <div className="col">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input onChange={(e) => setState({ ...state, title: e.target.value })} id="title" className="form-control" type="text" />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="companyName" className="form-label">Company</label>
                        <input id="companyName" className="form-control" type="text" value={companyName} readOnly />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="desc" className="form-label">Description</label>
                        <textarea onChange={(e) => setState({ ...state, desc: e.target.value })} id="desc" className="form-control" rows="5"></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="fileUpload" className="form-label">Attach images</label>
                        <input onChange={(e) => setState({ ...state, files: [...state.files, ...e.target.files] })} id="fileUpload" className="form-control" type="file" multiple />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <br />
                        <button className="btn btn-primary" onClick={submitWorkOrder}>Request Work Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewWorkOrder;