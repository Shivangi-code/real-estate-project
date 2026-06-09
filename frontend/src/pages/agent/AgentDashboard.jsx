import { Link } from "react-router-dom";

const AgentDashboard = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Agent Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={card}>
          <h3>Add Listing</h3>
          <p>Create property listing for clients.</p>
          <Link to="/add-property">Add Property</Link>
        </div>

        <div style={card}>
          <h3>My Listings</h3>
          <p>View properties listed by you.</p>
          <Link to="/agent/properties">View</Link>
        </div>

        <div style={card}>
          <h3>Client Leads</h3>
          <p>Manage buyer leads.</p>
          <Link to="/agent/leads">View Leads</Link>
        </div>

        <div style={card}>
          <h3>Profile</h3>
          <p>Update your agent profile.</p>
          <Link to="/agent/profile">Edit</Link>
        </div>
      </div>
    </div>
  );
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

export default AgentDashboard;