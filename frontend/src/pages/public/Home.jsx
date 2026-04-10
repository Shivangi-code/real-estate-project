import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyFilter from "../../components/PropertyFilter";
import FilterSidebar from "../../components/FilterSidebar";
import PropertyCard from "../../components/PropertyCard";
import "../../styles/home.css";

function Home() {
  const [properties, setProperties] = useState([]);
<<<<<<< HEAD
  const [showOnboarding, setShowOnboarding] = useState(false);

  const navigate = useNavigate();

  // ================= INIT =================
=======
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

>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
  useEffect(() => {
    fetchProperties();

    const seen = localStorage.getItem("onboardingSeen");

    if (!seen) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2500);
    }
  }, []);

<<<<<<< HEAD
  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/property/approved");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.log("Error fetching properties", error);
    }
  };

  // ================= ONBOARDING ACTIONS =================
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingSeen", "true");
  };

  const handleSellClick = () => {
    localStorage.setItem("intentSelected", "sell");
    localStorage.setItem("onboardingSeen", "true");
=======
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
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
    navigate("/login");
  };

  const handleBuyClick = () => {
    localStorage.setItem("intentSelected", "buy");
    handleCloseOnboarding();
  };

  // ================= UI =================
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

<<<<<<< HEAD
      {/* 🔥 PREMIUM ONBOARDING CARD */}
      {showOnboarding && (
        <div className="onboarding-card">

          <button
            className="onboarding-close"
            onClick={handleCloseOnboarding}
          >
            ✕
          </button>

          <h4>Welcome 👋</h4>
          <p>What would you like to do today?</p>

          <div className="onboarding-actions">
            <button className="buy-btn" onClick={handleBuyClick}>
              Buy
            </button>

            <button className="sell-btn" onClick={handleSellClick}>
              Sell
            </button>
=======
      {/* BUY / SELL POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>What do you want to do?</h2>
            <button onClick={handleBuy}>Buy Property</button>
            <button onClick={handleSell}>Sell Property</button>
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
          </div>

<<<<<<< HEAD
=======
      {/* ROLE POPUP */}
      {showRolePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Select Your Role</h2>
            <button onClick={() => selectRole("seller")}>Seller</button>
            <button onClick={() => selectRole("agent")}>Agent</button>
            <button onClick={() => selectRole("builder")}>Builder</button>
          </div>
>>>>>>> f717a4b9edc06de0eefd6c685bb552bd74a5c856
        </div>
      )}
    </div>
  );
}

export default Home;