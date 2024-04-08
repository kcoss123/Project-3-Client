import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { get, post } from '../services/authService';

const CompanyProfile = () => {
    const { handle } = useParams();
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [companyUsername] = useState(handle);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [reviews, setReviews] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        getCompanyProfile();
    }, []);

    const addReview = (e) => {
        e.preventDefault();
        if (title && desc && rating) {
            post("/addreview", { title, desc, rating, companyUsername })
                .then((res) => {
                    getCompanyProfile();
                })
                .catch((error) => {});
        }
    };

    const getCompanyProfile = () => {
        setLoading(true);
        post("/list/getcompanyprofile", { companyUsername })
            .then((res) => {
                setCompany(res.data.company);
                setReviews(res.data.reviews);
                setLoading(false);
            })
            .catch((error) => {
                setCompany(null);
                setError(true);
                setLoading(false);
            });
    };

    const companyText = (name) => {
        let text;
        if (name !== "maintenance") {
            text = name.slice(0, -1);
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (
        <div className="company-profile">
            <div className="container text-center">
                {loading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {error && !company && <p>Error retrieving profile</p>}
                {company && (
                    <>
                        <div className="row">
                            <div className="col">
                                <h1 className="display-4">{`${company.companyName} (@${company.username})`}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <h1 className="display-6">{companyText(company.category)}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p className="lead">{company.email}</p>
                                <p className="lead">{company.phone}</p>
                            </div>
                            <div className="col">
                                <div className="col">
                                    <p className="lead">{`${company.street}, ${company.unit ? `${company.unit} ` : ``}`}</p>
                                    <p className="lead">{`${company.city}, ${company.state}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>{company.about}</p>
                            </div>
                        </div>
                        <div className="row">
                            <hr />
                            <div className="col">
                                <h1 className="display-6">Recent Reviews</h1>
                            </div>
                        </div>
                        {reviews && reviews.length > 0 && (
                            <div className="row">
                                {reviews.slice(0, 3).map((review, index) => (
                                    <div className="col" key={index}>
                                        <div className="card text-center">
                                            <div className="card-header">{`${review.rating}/5`}</div>
                                            <div className="card-body">
                                                <h5 className="card-title">{review.title}</h5>
                                                <p className="card-text overflow-auto">{review.description}</p>
                                            </div>
                                            <div className="card-footer text-body-secondary">{review.updatedAt}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <br />
                        <div className="row">
                            <div className="col">
                                <button className="btn btn-primary mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#reviewCollapse" aria-expanded="false" aria-controls="reviewCollapse">
                                    Add Review
                                </button>
                            </div>
                            <div className="col">
                                <Link to="/" className="btn btn-primary mb-3">
                                    See All
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col-8">
                                <div className="collapse" id="reviewCollapse">
                                    <div className="card">
                                        <div className="card-header">@{username}'s Review</div>
                                        <div className="card-body">
                                            <input onChange={(e) => setTitle(e.target.value)} type="text" className="form-control mb-3" placeholder="Enter a title" value={title} />
                                            <textarea onChange={(e) => setDesc(e.target.value)} className="form-control mb-3" rows="3" placeholder="Enter your review" value={desc} />
                                            <div className="row">
                                                <p>Rating (out of 5)</p>
                                                <input onChange={(e) => setRating(e.target.value)} type="range" className="form-range" min="1" max="5" value={rating} />
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <button onClick={addReview} className="btn btn-primary">
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col"></div>
                        </div>
                        <br />
                    </>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;