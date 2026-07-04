import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AddProperty.css";

function AddProperty() {
  const navigate = useNavigate();

  // ======================================================
  // ================= FORM DATA ==========================
  // ======================================================

  const [formData, setFormData] = useState({
    title: "",

    // PRICE
    price: "",
    priceUnit: "lac",

    // AREA
    area: "",
    areaUnit: "sqft",

    // LOCATION
    location: "",

    // CATEGORY TYPE
    type: "",

    // SUB TYPE
    subType: "",

    // CONSTRUCTION
    constructionStatus: "",

    // DESCRIPTION
    description: "",
  });

  // ======================================================
  // ================= IMAGES =============================
  // ======================================================

  const [images, setImages] = useState([]);

  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  const [loading, setLoading] = useState(false);

  // ======================================================
  // ================= HANDLE CHANGE ======================
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // ================= HANDLE IMAGES ======================
  // ======================================================

  const handleImage = (e) => {
    setImages(Array.from(e.target.files));
  };

  // ======================================================
  // ================= SUBMIT =============================
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = new FormData();

      // ======================================================
      // ================= APPEND FORM DATA ===================
      // ======================================================

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // ======================================================
      // ================= MULTIPLE IMAGES ====================
      // ======================================================

      images.forEach((img) => {
        data.append("images", img);
      });

      // ======================================================
      // ================= API ================================
      // ======================================================

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/properties/add`,

        data,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        alert("Property Added Successfully 🚀");

        navigate("/properties");
      }
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ================= SUBTYPE OPTIONS ====================
  // ======================================================

  const subTypeOptions = {
    Residential: ["House", "Villa", "Flat", "Plot"],

    Commercial: ["Office", "Shop", "Showroom", "Commercial Land"],

    Agriculture: ["Farm Land", "Agriculture Land"],
  };

  return (
    <div className="add-wrapper">
      <div className="add-box">
        <h1>Add New Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ====================================================== */}
          {/* ================= TITLE ============================== */}
          {/* ====================================================== */}

          <div>
            <label>Property Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter property title"
              required
            />
          </div>

          {/* ====================================================== */}
          {/* ================= PRICE ============================== */}
          {/* ====================================================== */}

          <div className="grid-2">
            <div>
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter property price"
                required
              />
            </div>

            <div>
              <label>Price Unit</label>

              <select
                name="priceUnit"
                value={formData.priceUnit}
                onChange={handleChange}
              >
                <option value="lac">Lac</option>

                <option value="cr">Cr</option>
              </select>
            </div>
          </div>

          {/* ====================================================== */}
          {/* ================= AREA =============================== */}
          {/* ====================================================== */}

          <div className="grid-2">
            <div>
              <label>Area</label>

              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area"
              />
            </div>

            <div>
              <label>Area Unit</label>

              <select
                name="areaUnit"
                value={formData.areaUnit}
                onChange={handleChange}
              >
                <option value="sqft">Sq Ft</option>

                <option value="acre">Acre</option>
              </select>
            </div>
          </div>

          {/* ====================================================== */}
          {/* ================= LOCATION =========================== */}
          {/* ====================================================== */}

          <div>
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter property location"
              required
            />
          </div>

          {/* ====================================================== */}
          {/* ================= TYPE =============================== */}
          {/* ====================================================== */}

          <div>
            <label>Property Category</label>

            <select
              name="type"
              value={formData.type}
              onChange={(e) => {
                setFormData({
                  ...formData,

                  type: e.target.value,

                  // RESET SUBTYPE
                  subType: "",
                });
              }}
              required
            >
              <option value="">Select Type</option>

              <option value="Residential">Residential</option>

              <option value="Commercial">Commercial</option>

              <option value="Agriculture">Agriculture</option>
            </select>
          </div>

          {/* ====================================================== */}
          {/* ================= SUB TYPE =========================== */}
          {/* ====================================================== */}

          <div>
            <label>Property Sub Type</label>

            <select
              name="subType"
              value={formData.subType}
              onChange={handleChange}
              required
            >
              <option value="">Select Sub Type</option>

              {formData.type &&
                subTypeOptions[formData.type]?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          {/* ====================================================== */}
          {/* ================= CONSTRUCTION ======================= */}
          {/* ====================================================== */}

          <div>
            <label>Construction Status</label>

            <select
              name="constructionStatus"
              value={formData.constructionStatus}
              onChange={handleChange}
            >
              <option value="">Select Status</option>

              <option value="Ready To Move">Ready To Move</option>

              <option value="Under Construction">Under Construction</option>

              <option value="New Launch">New Launch</option>
            </select>
          </div>

          {/* ====================================================== */}
          {/* ================= DESCRIPTION ======================== */}
          {/* ====================================================== */}

          <div>
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter property description"
            />
          </div>

          {/* ====================================================== */}
          {/* ================= MULTIPLE IMAGES ==================== */}
          {/* ====================================================== */}

          <div>
            <label>Property Images</label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImage}
            />

            {/* ====================================================== */}
            {/* ================= IMAGE PREVIEW ====================== */}
            {/* ====================================================== */}

            {images.length > 0 && (
              <div className="preview-grid">
                {images.map((img, i) => (
                  <img key={i} src={URL.createObjectURL(img)} alt="preview" />
                ))}
              </div>
            )}
          </div>

          {/* ====================================================== */}
          {/* ================= BUTTON ============================= */}
          {/* ====================================================== */}

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;
