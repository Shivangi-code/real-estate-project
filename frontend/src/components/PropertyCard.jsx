import { motion } from "framer-motion";

import {
  Maximize2,
  Heart,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Hash,
  Building2,
  IndianRupee,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/property.css";

function PropertyCard({
  data,
  index,
}) {

  const [liked, setLiked] =
    useState(false);

  const navigate =
    useNavigate();

  // ================= FORMAT PRICE =================
  const formatPrice = (
    price
  ) => {

    if (!price)
      return "N/A";

    if (
      price >= 10000000
    ) {

      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (
      price >= 100000
    ) {

      return `₹ ${(price / 100000).toFixed(1)} L`;
    }

    return `₹ ${price}`;
  };

  // ================= OPEN PROPERTY =================
  const openProperty = () => {

    navigate(
      `/properties/${data._id}`
    );
  };

  // ================= IMAGE =================
  const imageUrl =
    data.image ||
    "https://via.placeholder.com/600x400?text=Property";

  // ================= UNIQUE PROPERTY ID =================
  const propertyId =
    data?._id
      ?.slice(-8)
      ?.toUpperCase();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -10,
      }}
      transition={{
        delay:
          index * 0.05,

        type: "spring",

        stiffness: 120,
      }}
      className="property-card group"
      onClick={openProperty}
    >

      {/* IMAGE */}
      <div className="card-image relative overflow-hidden">

        <motion.img
          src={imageUrl}
          alt={data.title}
          className="card-img"
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 0.4,
          }}
          onError={(e) => {

            e.target.src =
              "https://via.placeholder.com/600x400?text=Property";
          }}
        />

        {/* VERIFIED BADGE */}
        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg z-10">

          <ShieldCheck size={13} />

          Verified

        </div>

        {/* TYPE BADGE */}
        {data?.type && (

          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-full text-xs capitalize font-medium z-10">

            {data.type}

          </div>
        )}

        {/* FAVORITE */}
        <motion.button
          className="heart-btn"
          whileTap={{
            scale: 0.8,
          }}
          whileHover={{
            scale: 1.15,
          }}
          onClick={(e) => {

            e.stopPropagation();

            setLiked(
              !liked
            );
          }}
        >

          <Heart
            size={16}
            fill={
              liked
                ? "red"
                : "none"
            }
            stroke={
              liked
                ? "red"
                : "black"
            }
          />

        </motion.button>

        {/* VIEW BTN */}
        <div className="view-btn">

          View
          {" "}
          <ArrowUpRight size={14} />

        </div>

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />

      </div>

      {/* BODY */}
      <div className="card-body">

        {/* PROPERTY ID */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">

          <Hash size={13} />

          <span className="font-medium">
            Property ID:
          </span>

          <span className="font-bold tracking-wider text-slate-700">
            RE-
            {propertyId}
          </span>

        </div>

        {/* TITLE */}
        <h3 className="line-clamp-1 font-bold text-xl">

          {data.title ||
            "Untitled Property"}

        </h3>

        {/* LOCATION */}
        <p className="location flex items-center gap-2 mt-2">

          <MapPin size={15} />

          {data.location ||
            "Unknown location"}

        </p>

        {/* SUBTYPE */}
        <div className="flex flex-wrap gap-2 mt-3">

          <span className="type">

            {data.subType ||
              "Property"}

          </span>

          {data?.constructionStatus && (

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs capitalize font-medium">

              {data.constructionStatus}

            </span>
          )}

        </div>

        {/* DETAILS */}
        <div className="details mt-4 flex justify-between flex-wrap gap-3">

          <span className="flex items-center gap-2">

            <Maximize2 size={14} />

            {data.area || 0}
            {" "}
            sq ft

          </span>

          <span className="flex items-center gap-2">

            <Building2 size={14} />

            {data.config ||
              "Ready"}

          </span>

        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-500 text-sm mt-4 line-clamp-2 leading-6">

          {data.description ||
            "No description available for this property."}

        </p>

        {/* FOOTER */}
        <div className="bottom mt-5 flex justify-between items-center">

          {/* PRICE */}
          <p className="price flex items-center gap-1">

            <IndianRupee size={18} />

            {formatPrice(
              data.price
            )}

          </p>

        </div>

        {/* CTA */}
        <button
          onClick={(e) => {

            e.stopPropagation();

            openProperty();
          }}
          className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
        >

          View Details

          <ArrowUpRight size={16} />

        </button>

      </div>
    </motion.div>
  );
}

export default PropertyCard;