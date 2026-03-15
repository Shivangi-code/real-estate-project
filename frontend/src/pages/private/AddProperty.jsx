import { useState } from "react";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    type: "",
    subType: "",
    constructionStatus: "",
    description: "",
    image: null,
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first ❌");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch("http://localhost:5000/property/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Property Added Successfully ✅");
        console.log(result);
      } else {
        alert(result.message || "Failed to add property ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Property</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* Title */}
            <div>
              <label>Property Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. 3BHK Luxury Flat"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Price */}
            <div>
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Location */}
            <div>
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="City / Area"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Property Type */}
            <div>
              <label>Property Type</label>
              <select
                name="type"
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Farmland">Farmland</option>
              </select>
            </div>

            {/* Sub Type Dynamic */}
            {formData.type === "Residential" && (
              <div>
                <label>Residential Type</label>
                <select
                  name="subType"
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
            )}

            {formData.type === "Commercial" && (
              <div>
                <label>Commercial Type</label>
                <select
                  name="subType"
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select</option>
                  <option value="Office">Office</option>
                  <option value="Shop">Shop</option>
                  <option value="Showroom">Showroom</option>
                </select>
              </div>
            )}

            {/* Construction Status */}
            <div>
              <label>Construction Status</label>
              <select
                name="constructionStatus"
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select Status</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="New Launch">New Launch</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label>Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Property details..."
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Submit Property
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "750px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AddProperty;