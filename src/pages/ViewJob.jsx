import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { post } from '../services/authService';

const ViewJob = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [bid, setBid] = useState(null);
  const [bidDeleted, setBidDeleted] = useState(false);
  const [bids, setBids] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const username = localStorage.getItem('username');
  const company = localStorage.getItem('company');

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await post('/jobs/getjob', { jobId }); // Using post function from authService.js
        const { job, user, bid, bids } = response.data;
        setJob(job);
        setUser(user);
        setBid(bid);
        setBids(bids);
        setError(false);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [jobId]);

  const submitBid = async (e) => {
    e.preventDefault();
    if (Number(price) > 0) {
      try {
        const response = await post('/jobs/addbid', { price, desc, jobId, username, company }); // Using post function from authService.js
        setBidPlaced(true);
        setBid(response.data);
        setError(false);
        setBidDeleted(false);
      } catch (error) {
        setBidPlaced(false);
        setError(true);
        setBidDeleted(false);
        setBid(null);
      }
    }
  };

  const deleteBid = async (e) => {
    e.preventDefault();
    if (bid) {
      try {
        await post('/jobs/deletebid', { jobId }); // Using post function from authService.js
        setBidDeleted(true);
        setBid(null);
        setError(false);
        setBidPlaced(false);
      } catch (error) {
        setBidDeleted(false);
        setError(true);
        setBidPlaced(false);
      }
    }
  };

  const acceptBid = async (bidId) => {
    try {
      await post('/jobs/acceptbid', { bidId }); // Using post function from authService.js
      setAccepted(true);
      setBids(null);
    } catch (error) {
      setAccepted(false);
    }
  };

  const renderBidCards = () => bids.map((entry) => (
    <div key={entry._id} className="card">
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/profile/${entry.companyUser}`}>{entry.companyName}</Link> | ${entry.quote}
        </h5>
        <p className="card-text">{entry.description || "No additional information provided."}</p>
        <button className="btn btn-success" onClick={() => acceptBid(entry._id)}>Accept Bid</button>
      </div>
      <div className="card-footer">
        <small>Last updated at: {entry.updatedAt}</small>
      </div>
    </div>
  ));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Error retrieving job.</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div>
        <div>No job found.</div>
      </div>
    );
  }

  const capitalizedCat = job.category[0].toUpperCase() + job.category.slice(1);

  return (
    <div className="view-job">
      <div className="container text-center">
        {/* Job Details */}
        <h1>{job.title}</h1>
        <h2>@{user.username}</h2>
        <p>Category: {capitalizedCat}</p>
        <p>{job.description}</p>

        {/* Bids Section */}
        {bids && bids.length > 0 && (
          <div>
            <h3>Bids</h3>
            <div>{renderBidCards()}</div>
          </div>
        )}

        {/* Bid Submission Form for Companies */}
        {company && !bid && (
          <form onSubmit={submitBid}>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Your price" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Additional information"></textarea>
            <button type="submit">Submit Bid</button>
          </form>
        )}

        {/* Bid Deletion for Companies */}
        {company && bid && (
          <div>
            <p>Your current bid: ${bid.quote}</p>
            <p>Bid Description: {bid.description || "No description provided."}</p>
            <button onClick={deleteBid} className="btn btn-danger">Delete Bid</button>
          </div>
        )}

        {/* Message for Job Acceptance */}
        {accepted && (
          <div>
            <h4>Accepted Bid</h4>
            <p>This job has already accepted a bid.</p>
          </div>
        )}

        {/* Conditionally Rendered Message or Action Button for Users */}
        {company && !username && job.accepted && (
          <div>
            <p>This job has been accepted. No further actions can be taken.</p>
          </div>
        )}

        {/* Navigation or Actions for Non-company Users */}
        {username && !company && !job.accepted && (
          <div>
            <Link to={`/message/${job._id}`} className="btn btn-primary">Message Job Poster</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewJob;