import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyFilter from "../../components/PropertyFilter";
import FilterSidebar from "../../components/FilterSidebar";
import PropertyCard from "../../components/PropertyCard";
import "../../styles/home.css";

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);

  const navigate = useNavigate();

  // Fetch properties
  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/property/approved");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    const intentSelected = localStorage.getItem("intentSelected");

    if (!intentSelected) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Handlers
  const handleBuy = () => {
    localStorage.setItem("intentSelected", "buy");
    setShowPopup(false);
  };

  const handleSell = () => {
    setShowPopup(false);
    setShowRolePopup(true);
  };

  const selectRole = (role) => {
    localStorage.setItem("role", role);
    localStorage.setItem("intentSelected", "sell");
    navigate("/login");
  };

  return (
    <div>
      {/* HERO */}
      <div className="hero-section">
        <h1>Find Your Dream Property</h1>
        <p>Explore verified homes, flats and commercial properties</p>
      </div>

      {/* FILTER */}
      <PropertyFilter />

      {/* MAIN WRAPPER */}
      <div className="home-wrapper">
        {/* SIDEBAR */}
        <div className="sidebar-container">
          <FilterSidebar />
        </div>

        {/* PROPERTY GRID */}
        <div className="grid-container">
          <div className="property-grid">
            {loading ? (
              <p>Loading properties...</p>
            ) : properties.length === 0 ? (
              <p>No properties found</p>
            ) : (
              properties.map((property, index) => (
                <PropertyCard
                  key={property._id}
                  data={property}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* BUY / SELL POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>What do you want to do?</h2>
            <button onClick={handleBuy}>Buy Property</button>
            <button onClick={handleSell}>Sell Property</button>
          </div>
        </div>
      )}

      {/* ROLE POPUP */}
      {showRolePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Select Your Role</h2>
            <button onClick={() => selectRole("seller")}>Seller</button>
            <button onClick={() => selectRole("agent")}>Agent</button>
            <button onClick={() => selectRole("builder")}>Builder</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;