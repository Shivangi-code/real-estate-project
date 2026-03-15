import { useEffect, useState } from "react";

const PendingProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/properties/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProperties(data);
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/admin/property/${id}/approve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPending(); // refresh
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/admin/property/${id}/reject`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPending(); // refresh
  };

  return (
    <div>
      <h2>Pending Properties</h2>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {properties.map((property) => (
          <div key={property._id} style={styles.card}>
            <h3>{property.title}</h3>
            <p>₹ {property.price}</p>
            <p>{property.location}</p>
            <p>
              Added By: <b>{property.createdBy?.name}</b> ({property.createdBy?.role})
            </p>

            <div style={{ marginTop: "10px" }}>
              <button
                style={styles.approve}
                onClick={() => handleApprove(property._id)}
              >
                Approve
              </button>

              <button
                style={styles.reject}
                onClick={() => handleReject(property._id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  approve: {
    background: "#16a34a",
    color: "white",
    padding: "8px 15px",
    border: "none",
    marginRight: "10px",
    cursor: "pointer",
  },
  reject: {
    background: "#dc2626",
    color: "white",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
  },
};

export default PendingProperties;