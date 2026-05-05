import { motion } from "framer-motion";
import { Maximize2, Heart, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/property.css";

function PropertyCard({ data, index }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (!price) return "N/A";

    if (price >= 10000000)
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;

    if (price >= 100000)
      return `₹ ${(price / 100000).toFixed(1)} L`;

    return `₹ ${price}`;
  };

  const openProperty = () => {
    navigate(`/property/${data._id}`);
  };

  const imageUrl =
    data.image ||
    "https://via.placeholder.com/600x400?text=Property";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 120,
      }}
      className="property-card"
      onClick={openProperty}
    >
      {/* IMAGE */}
      <div className="card-image">
        <motion.img
          src={imageUrl}
          alt={data.title}
          className="card-img"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />

        <span className="badge">
          Verified
        </span>

        <motion.button
          className="heart-btn"
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.2 }}
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart
            size={16}
            fill={liked ? "red" : "none"}
            stroke={liked ? "red" : "black"}
          />
        </motion.button>

        <div className="view-btn">
          View <ArrowUpRight size={14} />
        </div>
      </div>

      {/* BODY */}
      <div className="card-body">
        <h3>{data.title}</h3>

        <p className="location">
          {data.location || "Unknown location"}
        </p>

        <span className="type">
          {data.subType || "Property"}
        </span>

        <div className="details">
          <span>
            <Maximize2 size={14} />{" "}
            {data.area || 0} sq ft
          </span>

          <span>
            {data.config || "Ready"}
          </span>
        </div>

        <div className="bottom">
          <p className="price">
            {formatPrice(data.price)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;