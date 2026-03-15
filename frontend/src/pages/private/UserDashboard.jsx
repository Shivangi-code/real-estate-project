import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/property/my-properties", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProperties(data);
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "rejected") return "red";
    return "orange";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {role?.toUpperCase()}</h2>
        <button onClick={() => navigate("/add-property")} style={styles.addBtn}>
          + Add Property
        </button>
      </div>

      <h3>My Properties</h3>

      <div style={styles.grid}>
        {properties.length === 0 && <p>No properties added yet.</p>}

        {properties.map((property) => (
          <div key={property._id} style={styles.card}>
            <h4>{property.title}</h4>
            <p>₹ {property.price}</p>
            <p>{property.location}</p>

            <span
              style={{
                ...styles.status,
                backgroundColor: getStatusColor(property.status),
              }}
            >
              {property.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  grid: {
    marginTop: "20px",
    display: "grid",
    gap: "20px",
  },
  card: {
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  status: {
    padding: "5px 10px",
    color: "white",
    borderRadius: "5px",
    fontSize: "12px",
  },
};

export default UserDashboard;