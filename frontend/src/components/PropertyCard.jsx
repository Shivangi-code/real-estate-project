import { motion } from "framer-motion";
import { Maximize2, Heart, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import "../styles/property.css";

function PropertyCard({ data, index }) {

  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ delay: index * 0.05 }}
      className="property-card"
    >
      {/* IMAGE */}
      <div className="card-image">

        {data.image ? (
          <motion.img
            src={`http://localhost:5000/uploads/${data.image}`}
            alt={data.title}
            className="card-img"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="card-placeholder">
            No Image
          </div>
        )}

        <span className="badge">For Sale</span>

        <button
          className="heart-btn"
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <Heart size={16} fill={liked ? "red" : "none"} />
        </button>

        <div className="view-btn">
          View <ArrowUpRight size={14} />
        </div>

      </div>

      {/* BODY */}
      <div className="card-body">
        <h3>{data.title}</h3>
        <p className="location">{data.location}</p>

        <span className="type">{data.subType}</span>

        <div className="details">
          <span>
            <Maximize2 size={14} /> {data.area} sq ft
          </span>
          <span>{data.config}</span>
        </div>

        <div className="bottom">
          <p className="price">₹ {data.price}</p>
        </div>
      </div>

    </motion.div>
  );
}

export default PropertyCard;