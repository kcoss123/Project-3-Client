import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context"; // Import the AuthContext
import { post } from "../services/authService";

class Inbox extends Component {
  static contextType = AuthContext; // Set up contextType to access context

  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      error: false,
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      await this.getInbox();
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  }

  async getInbox() {
    const { isLoggedIn, user } = this.context; // Access isLoggedIn and user from context
    if (!isLoggedIn || !user) {
      throw new Error("User not authenticated");
    }

    const { username, company } = user;
    const response = await post("/list/inbox", { username, company });
    this.setState({ threads: response.data });
  }

  render() {
    const { loading, threads } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    // Redirect to login if user is not authenticated
    if (!this.context.isLoggedIn) {
      return <Navigate push to="/login" />;
    }

    return (
      <div className="inbox">
        <br />
        <div className="container">
          {threads.length > 0 ? (
            <div className="list-group">
              {threads.map((thread) => (
                <Link
                  key={thread.id || thread._id}
                  className="list-group-item list-group-item-action"
                  to={`/message/${thread.job}`}
                >
                  {`${thread.title} (@${thread.username})`}
                </Link>
              ))}
            </div>
          ) : (
            <p className="lead">No messages to show.</p>
          )}
        </div>
      </div>
    );
  }
}

export default Inbox;
