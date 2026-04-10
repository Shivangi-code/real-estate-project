import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PropertyFilter from "../../components/PropertyFilter";
import FilterSidebar from "../../components/FilterSidebar";
import PropertyCard from "../../components/PropertyCard";
import "../../styles/home.css";

function Home() {

  const [properties, setProperties] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const navigate = useNavigate();

  // ================= INIT =================
  useEffect(() => {
    fetchProperties();

    const seen = localStorage.getItem("onboardingSeen");

    if (!seen) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2500);
    }

  }, []);

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
    navigate("/login");
  };

  const handleBuyClick = () => {
    localStorage.setItem("intentSelected", "buy");
    handleCloseOnboarding();
  };

  // ================= UI =================
  return (
    <div>

      <Navbar />

      {/* HERO */}
      <div className="hero-section">
        <h1>Find Your Dream Property in Jabalpur</h1>
        <p>Explore verified homes, flats and commercial properties</p>
      </div>

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

            {properties.length === 0 ? (
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
          </div>

        </div>
      )}

    </div>
  );
}

export default Home;