import { useEffect, useState } from "react";

const ApprovedProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchApproved();
  }, []);

  const fetchApproved = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/properties/approved", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProperties(data);
  };

  return (
    <div>
      <h2>Approved Properties</h2>

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {properties.map((property) => (
          <div key={property._id} style={styles.card}>
            <h3>{property.title}</h3>
            <p>₹ {property.price}</p>
            <p>{property.location}</p>
            <p>
              Added By: <b>{property.createdBy?.name}</b> ({property.createdBy?.role})
            </p>
            <p>Status: <b>{property.status}</b></p>
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
};

export default ApprovedProperties;