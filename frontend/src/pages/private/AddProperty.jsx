import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // ✅ USER
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ ROLE CHECK
  useEffect(() => {
    if (
      !user ||
      !["seller", "builder", "admin"].includes(user.role)
    ) {
      navigate("/login");
    }
  }, [user, navigate]);

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

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });

      setPreview(
        URL.createObjectURL(files[0])
      );
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/property/add",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: data,
        }
      );

      const result = await res.json();

      if (res.ok) {

        // ✅ ADMIN MESSAGE
        if (user?.role === "admin") {
          alert(
            "Property published instantly 🚀"
          );
        } else {
          alert(
            "Property submitted for review ✅"
          );
        }

        // RESET
        setFormData({
          title: "",
          price: "",
          location: "",
          type: "",
          subType: "",
          constructionStatus: "",
          description: "",
          image: null,
        });

        setPreview(null);

        // ✅ ADMIN REDIRECT
        if (user?.role === "admin") {
          navigate("/admin/properties/approved");
        } else {
          navigate(-1);
        }

      } else {
        alert(
          result.message ||
            "Failed to add property ❌"
        );
      }

    } catch (error) {

      console.error(error);

      alert("Server error ❌");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* TOP BAR */}
        <div style={styles.topBar}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.backBtn}
          >
            ← Back
          </button>

          <h2 style={styles.heading}>
            Add Property
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>

            {/* TITLE */}
            <div>
              <label>
                Property Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="e.g. 3BHK Luxury Flat"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* PRICE */}
            <div>
              <label>
                Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                placeholder="Enter price"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* LOCATION */}
            <div>
              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                placeholder="City / Area"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* PROPERTY TYPE */}
            <div>
              <label>
                Property Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">
                  Select Type
                </option>

                <option value="Residential">
                  Residential
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Agriculture">
                  Agriculture
                </option>
              </select>
            </div>

            {/* RESIDENTIAL */}
            {formData.type ===
              "Residential" && (
              <div>
                <label>
                  Residential Type
                </label>

                <select
                  name="subType"
                  value={formData.subType}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="1BHK">
                    1BHK
                  </option>

                  <option value="2BHK">
                    2BHK
                  </option>

                  <option value="3BHK">
                    3BHK
                  </option>

                  <option value="Villa">
                    Villa
                  </option>
                </select>
              </div>
            )}

            {/* COMMERCIAL */}
            {formData.type ===
              "Commercial" && (
              <div>
                <label>
                  Commercial Type
                </label>

                <select
                  name="subType"
                  value={formData.subType}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Office">
                    Office
                  </option>

                  <option value="Shop">
                    Shop
                  </option>

                  <option value="Showroom">
                    Showroom
                  </option>
                </select>
              </div>
            )}

            {/* AGRICULTURE */}
            {formData.type ===
              "Agriculture" && (
              <div>
                <label>
                  Agriculture Type
                </label>

                <select
                  name="subType"
                  value={formData.subType}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Farm Land">
                    Farm Land
                  </option>

                  <option value="Agriculture Plot">
                    Agriculture Plot
                  </option>
                </select>
              </div>
            )}

            {/* CONSTRUCTION */}
            <div>
              <label>
                Construction Status
              </label>

              <select
                name="constructionStatus"
                value={
                  formData.constructionStatus
                }
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">
                  Select Status
                </option>

                <option value="Under Construction">
                  Under Construction
                </option>

                <option value="Ready to Move">
                  Ready to Move
                </option>

                <option value="New Launch">
                  New Launch
                </option>
              </select>
            </div>

            {/* IMAGE */}
            <div>
              <label>
                Upload Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            {/* PREVIEW */}
            {preview && (
              <div>
                <label>
                  Preview
                </label>

                <img
                  src={preview}
                  alt="preview"
                  style={styles.preview}
                />
              </div>
            )}

            {/* DESCRIPTION */}
            <div
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="4"
                value={formData.description}
                placeholder="Property details..."
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,

              opacity: loading
                ? 0.7
                : 1,

              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Submit Property"}
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
    borderRadius: "12px",
    width: "760px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  backBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#e5e7eb",
    cursor: "pointer",
    fontWeight: "600",
  },

  heading: {
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  preview: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "8px",
    marginTop: "5px",
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
    fontWeight: "bold",
  },
};

export default AddProperty;