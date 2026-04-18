import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/admin/properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await res.json();
      setProperties(data);

    } catch (error) {
      console.error("Admin fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      {/* LOADING */}
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            marginTop: "20px",
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Location</th>
              <th>Added By</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((property) => (
              <tr key={property._id}>
                <td>{property.title || "N/A"}</td>
                <td>₹{property.price || "N/A"}</td>
                <td>{property.location || "N/A"}</td>
                <td>{property.createdBy?.name || "N/A"}</td>
                <td>{property.createdBy?.role || "N/A"}</td>
                <td>{property.status || "pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔥 Nested routes */}
      <div style={{ marginTop: "40px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;