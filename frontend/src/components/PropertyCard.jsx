import { motion } from "framer-motion";

import {
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Hash,
  BadgeCheck,
  ScanLine,
  Tag,
  Building2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../styles/property.css";

function PropertyCard({
  data,
  index,
}) {

  const navigate =
    useNavigate();

  // ================= FORMAT PRICE =================

  const formatPrice =
    (price) => {

      if (!price)
        return "N/A";

      const num =
        Number(price);

      // STORED AS LACS

      if (num < 1000) {

        return `₹ ${num} L`;
      }

      // CRORES

      if (num >= 10000000) {

        return `₹ ${(num / 10000000).toFixed(1)} Cr`;
      }

      // LACS

      if (num >= 100000) {

        return `₹ ${(num / 100000).toFixed(1)} L`;
      }

      return `₹ ${num.toLocaleString()}`;
    };

  // ================= OPEN PROPERTY =================

  const openProperty =
    () => {

      navigate(
        `/properties/${data._id}`
      );
    };

  // ================= IMAGE =================

  const imageUrl =
    data?.image ||
    "https://via.placeholder.com/600x400?text=Property";

  // ================= PROPERTY ID =================

  const propertyId =
    data?.propertyUniqueId ||
    `RE-${data?._id
      ?.slice(-8)
      ?.toUpperCase()}`;

  // ================= STATUS =================

  const isSold =
    data?.businessStatus ===
    "sold";

  const underNegotiation =
    data?.underNegotiation;

  // ================= AREA =================

  const area =
    parseFloat(
      data?.area || 0
    );

  // ================= PRICE FIX =================

  const actualPrice =
    Number(data?.price || 0);

  // IF STORED AS LACS

  const finalPrice =

    actualPrice < 1000

      ? actualPrice * 100000

      : actualPrice;

  // ================= PRICE PER SQFT =================

  const pricePerUnit =
    Number(area) > 0

      ? Math.round(
          finalPrice /
          Number(area)
        )

      : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      transition={{
        delay:
          index * 0.05,

        type: "spring",

        stiffness: 120,
      }}
      className="
        property-card
        w-full
        min-w-0
      "
      onClick={openProperty}
    >

      {/* ================= IMAGE ================= */}

      <div className="relative overflow-hidden h-[220px] sm:h-[190px]">

        <motion.img
          src={imageUrl}
          alt={data?.title}
          className={`w-full h-full object-cover transition duration-500 ${
            isSold
              ? "grayscale-[20%]"
              : ""
          }`}
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.4,
          }}
          onError={(e) => {

            e.target.src =
              "https://via.placeholder.com/600x400?text=Property";
          }}
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* VERIFIED */}

        {!isSold && (

          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md z-10">

            <ShieldCheck size={13} />

            Verified

          </div>
        )}

        {/* SOLD */}

        {isSold && (

          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md z-20">

            SOLD

          </div>
        )}

        {/* NEGOTIATION */}

        {!isSold &&
          underNegotiation && (

            <div className="absolute top-11 left-3 bg-yellow-400 text-slate-900 px-2 py-1 rounded-full text-[10px] font-bold shadow-md z-20 flex items-center gap-1">

              <BadgeCheck size={10} />

              Negotiation

            </div>
          )}

        {/* VIEW PHOTOS */}

        <div className="absolute bottom-3 left-3 bg-[#071133]/90 text-white px-3 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-md z-10">

          View Photos

        </div>

        {/* STATUS */}

        <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-semibold capitalize shadow-md ${
          isSold
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>

          {data?.businessStatus ||
            "available"}

        </div>

      </div>

      {/* ================= BODY ================= */}

      <div className="p-4">

        {/* PROPERTY ID */}

        <div className="flex items-center gap-1 text-[11px] text-slate-500">

          <Hash size={11} />

          <span>
            Property ID:
          </span>

          <span className="font-bold tracking-wide text-slate-700">

            {propertyId}

          </span>

        </div>

        {/* TITLE */}

        <h3 className="mt-2 text-lg font-bold text-slate-900 line-clamp-1 capitalize">

          {data?.title ||
            "Untitled Property"}

        </h3>

        {/* LOCATION */}

        <p className="flex items-center gap-1 text-slate-500 mt-2 text-xs">

          <MapPin size={13} />

          {data?.location ||
            "Unknown location"}

        </p>

        {/* TAGS */}

        <div className="flex flex-wrap items-center gap-2 mt-2">

          {data?.type && (

            <div className="bg-slate-100 px-2 py-1 rounded-full text-[10px] font-medium text-slate-700 flex items-center gap-1">

              <Building2 size={10} />

              <span className="capitalize">

                {data?.type}

              </span>

            </div>
          )}

        </div>

        {/* DESCRIPTION */}

        {data?.description && (

          <p className="text-slate-500 text-[11px] mt-2 line-clamp-1 leading-4">

            {data?.description}

          </p>
        )}

        {/* PRICE */}

        <div className="mt-3">

          <p className={`text-xl sm:text-2xl font-bold ${
            isSold
              ? "text-red-600"
              : "text-[#071133]"
          }`}>

            {formatPrice(
              data?.price
            )}

          </p>

          <p className="text-slate-400 mt-1 text-[10px]">

            All Inclusive

          </p>

        </div>

        {/* ================= AREA + PRICE ================= */}

        <div className="mt-3 border border-slate-200 rounded-2xl overflow-hidden bg-white">

          <div className="grid grid-cols-2">

            {/* AREA */}

            <div className="p-3 border-r border-slate-200 flex items-center gap-2 min-h-[60px]">

              <div className="bg-blue-50 p-2 rounded-xl">

                <ScanLine
                  size={14}
                  className="text-blue-600"
                />

              </div>

              <div>

                <p className="text-slate-500 text-[10px]">

                  Area

                </p>

                <h3 className="font-bold text-xs text-slate-900">

                  {data?.area &&
                  Number(data.area) > 0

                    ? `${Number(data.area).toLocaleString()} ${data?.areaUnit || "sqft"}`

                    : "Area Not Added"}

                </h3>

              </div>

            </div>

            {/* PRICE PER SQFT */}

            <div className="p-3 flex items-center gap-2 min-h-[60px]">

              <div className="bg-green-50 p-2 rounded-xl">

                <Tag
                  size={14}
                  className="text-green-600"
                />

              </div>

              <div>

                <p className="text-slate-500 text-[10px]">

                  Price/{data?.areaUnit || "sqft"}

                </p>

                <h3 className="font-bold text-xs text-slate-900">

                  {data?.area &&
                  Number(pricePerUnit) > 0

                    ? `₹ ${Number(pricePerUnit).toLocaleString()}/${data?.areaUnit || "sqft"}`

                    : "Price NA"}

                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* ================= BUTTON ================= */}

        <button
          onClick={(e) => {

            e.stopPropagation();

            openProperty();
          }}
          className={`w-full mt-3 py-3 sm:py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isSold
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-[#071133] hover:bg-[#0b1d57] text-white"
          }`}
        >

          {isSold
            ? "Sold Property"
            : "View Details"}

          <ArrowUpRight size={15} />

        </button>

      </div>

    </motion.div>
  );
}

export default PropertyCard;