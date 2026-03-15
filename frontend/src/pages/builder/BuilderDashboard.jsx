import { Link } from "react-router-dom";

const BuilderDashboard = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Builder Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={card}>
          <h3>Add Project</h3>
          <p>Create a new project listing.</p>
          <Link to="/add-property">Add Project</Link>
        </div>

        <div style={card}>
          <h3>My Projects</h3>
          <p>Manage your real estate projects.</p>
          <Link to="/builder/properties">View Projects</Link>
        </div>

        <div style={card}>
          <h3>Units Available</h3>
          <p>Track available units in projects.</p>
        </div>

        <div style={card}>
          <h3>Profile</h3>
          <p>Edit builder profile.</p>
          <Link to="/builder/profile">Edit</Link>
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

export default BuilderDashboard;