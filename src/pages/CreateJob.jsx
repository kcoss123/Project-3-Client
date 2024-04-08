import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { post } from '../services/authService';
import { AuthContext } from '../context/auth.context';

function CreateJob() {
    const { isLoggedIn, username } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        category: "Plumber", // Default to the first category
        files: [], // Array to hold uploaded files
        handymen: [], // Array to hold selected handymen
        error: false,
        redirect: false,
    });

    const { title, desc, category, files, handymen, error, redirect } = formData;

    const validateJob = () => {
        const isValid = title && desc && category;
        setFormData({ ...formData, error: !isValid });
        return isValid;
    };

    const createJob = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        console.log("FormData:", formData);
        if (validateJob()) {
            const formDataToSend = new FormData();
            formDataToSend.append("title", title);
            formDataToSend.append("desc", desc);
            formDataToSend.append("category", category);
            formDataToSend.append("username", username); // Assuming username is available
            files.forEach((file) => {
                formDataToSend.append("files", file);
            });
            handymen.forEach((handyman) => {
                formDataToSend.append("handymen", handyman);
            });
    
            console.log("FormDataToSend:", formDataToSend);
    
            post("/jobs/createjob", formDataToSend)
                .then(() => {
                    console.log("Job created successfully");
                    setFormData({ ...formData, redirect: true });
                }).catch((error) => {
                    console.error("Error creating job:", error);
                    setFormData({ ...formData, error: true });
                });
        } else {
            console.log("Form validation failed");
        }
    };
    

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (redirect) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-5 text-center">Create Job</h2>
                {error &&
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline">Please ensure that all required fields are completed correctly.</span>
                    </div>
                }
                <form onSubmit={createJob}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Job Title</label>
                        <input type="text" className="form-input" id="title" value={title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">Job Description</label>
                        <textarea className="form-textarea" id="desc" value={desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select className="form-select" id="category" value={category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="Plumber">Plumber</option>
                            <option value="Electrician">Electrician</option>
                            <option value="Handyman">Handyman</option>
                        </select>
                    </div>
                    {/* File Upload Field */}
                    <div className="mb-3">
                        <label htmlFor="files" className="form-label">Files</label>
                        <input type="file" className="form-input" id="files" multiple onChange={(e) => setFormData({ ...formData, files: [...e.target.files] })} />
                    </div>
                    {/* Handyman Selection Field */}
                    <div className="mb-3">
                        {/* Assuming you have a list of handymen to select from */}
                        <label htmlFor="handymen" className="form-label">Handymen</label>
                        <select className="form-select" id="handymen" multiple value={handymen} onChange={(e) => setFormData({ ...formData, handymen: Array.from(e.target.selectedOptions, option => option.value) })}>
                            {/* Map through your list of handymen and create options */}
                            <option value="handyman1">Handyman 1</option>
                            <option value="handyman2">Handyman 2</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreateJob;
