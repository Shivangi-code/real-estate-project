import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={card}>
          <h3>Total Users</h3>
          <h2>120</h2>
        </div>

        <div style={card}>
          <h3>Pending Properties</h3>
          <h2>15</h2>
          <Link to="/admin/properties/pending">View</Link>
        </div>

        <div style={card}>
          <h3>Approved Properties</h3>
          <h2>80</h2>
          <Link to="/admin/properties/approved">View</Link>
        </div>

        <div style={card}>
          <h3>Total Listings</h3>
          <h2>95</h2>
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

export default Overview;