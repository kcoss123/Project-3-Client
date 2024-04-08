import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HandymanLogin from "./pages/HandymanLogin";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NewWorkOrder from "./pages/NewWorkOrder";
import CompanyProfile from "./pages/CompanyProfile";
import Messages from "./pages/Messages";
import DeleteWorkOrder from "./pages/DeleteWorkOrder";
import CreateJob from "./pages/CreateJob";
import ViewJob from "./pages/ViewJob";
import DeleteJob from "./pages/DeleteJob";
import Inbox from "./pages/Inbox";
import Marketplace from "./pages/Marketplace";
import HandymanDashboard from "./pages/HandymanDashboard";

const App = () => {
  return (
    <div className="main">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/handyman-login" element={<HandymanLogin />} />
          <Route path="/handymandashboard" element={<HandymanDashboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/request-workorder/:handle" element={<NewWorkOrder />} />
          <Route path="/profile/:handle" element={<CompanyProfile />} />
          <Route path="/message/:jobid" element={<Messages />} />
          <Route path="/:orderId/delete" element={<DeleteWorkOrder />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/view-job/:jobId" element={<ViewJob />} />
          <Route path="/delete-job/:jobId" element={<DeleteJob />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </Layout>
    </div>
  );
};

export default App;
