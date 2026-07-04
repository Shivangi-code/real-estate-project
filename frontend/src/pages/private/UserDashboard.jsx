import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function UserDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "user";

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/property/my-properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "#16a34a";
    if (status === "rejected") return "#dc2626";
    return "#f59e0b";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {role.toUpperCase()}</h2>

        <button
          onClick={() => navigate("/add-property")}
          style={styles.addBtn}
        >
          + Add Property
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>My Properties</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {properties.length === 0 && <p>No properties added yet.</p>}

          {properties.map((property) => (
            <div key={property._id} style={styles.card}>
              {property.image && (
                <img
                  src={property.image}
                  alt={property.title}
                  style={styles.image}
                />
              )}

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
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "#f8fafc",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },

  addBtn: {
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  card: {
    padding: "18px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "12px",
  },

  status: {
    display: "inline-block",
    marginTop: "10px",
    padding: "6px 12px",
    color: "white",
    borderRadius: "6px",
    fontSize: "12px",
    textTransform: "capitalize",
  },
};

export default UserDashboard;