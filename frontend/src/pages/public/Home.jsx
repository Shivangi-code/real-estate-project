import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyFilter from "../../components/PropertyFilter";
import FilterSidebar from "../../components/FilterSidebar";
import PropertyCard from "../../components/PropertyCard";
import "../../styles/home.css";

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/property/approved");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.log("Error fetching properties", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchProperties();

    const seen = localStorage.getItem("onboardingSeen");

    if (!seen) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
    }
  }, []);

  // ================= ONBOARDING =================
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingSeen", "true");
  };

  const handleBuyClick = () => {
    localStorage.setItem("intentSelected", "buy");
    handleCloseOnboarding();
  };

  const handleSellClick = () => {
    localStorage.setItem("intentSelected", "sell");
    localStorage.setItem("onboardingSeen", "true");
    navigate("/login");
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

      {/* MAIN */}
      <div className="home-wrapper">
        {/* SIDEBAR */}
        <div className="sidebar-container">
          <FilterSidebar />
        </div>

        {/* GRID */}
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

      {/* ONBOARDING */}
      {showOnboarding && (
        <div className="onboarding-card">
          <button className="onboarding-close" onClick={handleCloseOnboarding}>
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