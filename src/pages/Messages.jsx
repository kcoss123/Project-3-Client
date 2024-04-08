import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { post } from '../services/authService';

const Message = ({ msg, sender }) => (
  <div className="col-6">
    {msg.sender === sender ? (
      <MessageCard msg={msg} />
    ) : (
      <MessageCard msg={msg} />
    )}
    <br />
  </div>
);

const MessageCard = ({ msg }) => (
  <div className="card">
    <div className="card-body">{msg.content.text}</div>
    <div className="card-footer text-body-secondary">{msg.timestamp}</div>
  </div>
);

const Messages = () => {
  const { jobid } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState(null);
  const [job, setJob] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [company, setCompany] = useState(localStorage.getItem("company"));

  const sender = username ? username : company;

  useEffect(() => {
    getMessages();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMsg) {
      post("/jobs/addjobmessage", { username, company, jobid, newMsg }) // Using post function from authService.js
        .then((res) => {
          getMessages();
        })
        .catch((error) => {
          setError(true);
        });
    }
    setNewMsg("");
  };

  const getMessages = () => {
    setLoading(true);
    post("/jobs/jobmessages", { username, company, jobid }) // Using post function from authService.js
      .then((res) => {
        setMessages(res.data.messages);
        setJob(res.data.job);
        setNewMsg("");
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  const renderMessages = () => {
    if (messages && !error) {
      return messages.length > 0 ? (
        <div className="container overflow-auto">
          {messages.map((msg, index) => (
            <div className="row" key={index}>
              <Message msg={msg} sender={sender} />
            </div>
          ))}
        </div>
      ) : (
        <div className="container">
          <p className="text-center">Begin the conversation</p>
        </div>
      );
    } else if (error) {
      return (
        <div className="container">
          <p className="text-center">Database Error</p>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="job-messages">
      <br />
      <div className="container">
        <p className="text-center lead">
          <Link to={`/view-job/${jobid}`}>Job: <b>{job && job.title}</b></Link>
        </p>
        {renderMessages()}
        <br />
        <div className="input-group mb-3">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Send a message..."
          />
          <button
            onClick={sendMessage}
            className="btn btn-outline-secondary"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;