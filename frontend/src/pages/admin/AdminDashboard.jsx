import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/properties", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProperties(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      {/* Main Dashboard Table */}
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
              <td>{property.title}</td>
              <td>₹{property.price}</td>
              <td>{property.location}</td>
              <td>{property.createdBy?.name}</td>
              <td>{property.createdBy?.role}</td>
              <td>{property.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 👇 Nested routes will render here */}
      <div style={{ marginTop: "40px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;