import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Expand,
} from "lucide-react";

export default function PropertyDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeImage, setActiveImage] =
    useState(0);

  // ======================================================
  // ================= FETCH PROPERTY =====================
  // ======================================================

  useEffect(() => {

    const fetchProperty =
      async () => {

        try {

          const res =
            await fetch(
              `http://localhost:5000/api/properties/${id}`
            );

          const data =
            await res.json();

          setProperty(
            data.property || data
          );

        } catch (error) {

          console.log(
            "DETAILS ERROR ❌",
            error
          );

          setProperty(null);

        } finally {

          setLoading(false);
        }
      };

    fetchProperty();

  }, [id]);

  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">

        Loading Property...

      </div>
    );
  }

  // ======================================================
  // ================= NOT FOUND ==========================
  // ======================================================

  if (!property) {

    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">

        Property Not Found

      </div>
    );
  }

  // ======================================================
  // ================= IMAGES =============================
  // ======================================================

  const images =
    property?.images?.length > 0
      ? property.images.map(
          (img) =>
            typeof img ===
            "string"
              ? img
              : img.url
        )
      : property?.image
      ? [property.image]
      : [
          "https://via.placeholder.com/1200x700?text=Property",
        ];

  // ======================================================
  // ================= FORMAT PRICE =======================
  // ======================================================

  const formatPrice =
    (price) => {

      if (!price)
        return "₹ N/A";

      // SMALL VALUES LIKE 35

      if (price < 1000) {

        return `₹ ${price} L`;
      }

      // CRORES

      if (
        price >= 10000000
      ) {

        return `₹ ${(price / 10000000).toFixed(2)} Cr`;
      }

      // LACS

      if (
        price >= 100000
      ) {

        return `₹ ${(price / 100000).toFixed(2)} L`;
      }

      return `₹ ${price}`;
    };

  // ======================================================
  // ================= AREA UNIT ==========================
  // ======================================================

  const areaUnit =
    property?.areaUnit ||
    "sqft";

  // ======================================================
  // ================= PRICE PER UNIT =====================
  // ======================================================

  let pricePerUnit =
    "N/A";

  // AGRICULTURE LAND

  if (
    areaUnit ===
    "acre"
  ) {

    pricePerUnit =
      `₹ ${property.price} L/acre`;
  }

  // NORMAL PROPERTY

  else {

    const actualPrice =
      property.price < 1000
        ? property.price *
          100000
        : property.price;

    pricePerUnit =
      property.area
        ? `₹ ${Math.round(
            actualPrice /
              property.area
          ).toLocaleString()}/sqft`
        : "N/A";
  }

  return (

    <div className="bg-slate-100 min-h-screen py-5 md:py-8 px-3 md:px-5">

      <div className="max-w-7xl mx-auto">

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            navigate(-1)
          }
          className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all mb-5"
        >

          <ArrowLeft size={18} />

          Back

        </button>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT */}

          <div className="lg:col-span-2">

            {/* IMAGE */}

            <div className="bg-black rounded-[24px] overflow-hidden shadow-sm relative">

              <img
                src={
                  images[
                    activeImage
                  ]
                }
                alt={
                  property.title
                }
                className="w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] object-cover"
              />

              <button
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 transition-all text-white p-3 rounded-full"
              >

                <Expand size={18} />

              </button>

            </div>

            {/* THUMBNAILS */}

            {images.length >
              1 && (

              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                {images.map(
                  (
                    img,
                    index
                  ) => (

                    <img
                      key={index}
                      src={img}
                      alt=""
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                      className={`w-20 h-16 rounded-xl object-cover cursor-pointer border-4 transition-all ${
                        activeImage ===
                        index
                          ? "border-blue-600"
                          : "border-transparent"
                      }`}
                    />
                  )
                )}

              </div>
            )}

            {/* DETAILS */}

            <div className="bg-white rounded-[24px] shadow-sm p-5 md:p-7 mt-5">

              {/* ID */}

              <p className="text-slate-500 font-semibold tracking-widest text-xs md:text-sm">

                #
                {" "}
                {
                  property.propertyUniqueId ||
                  `RE-${property?._id
                    ?.slice(-6)
                    ?.toUpperCase()}`
                }

              </p>

              {/* TITLE */}

              <h1 className="text-2xl md:text-4xl font-black mt-3 text-slate-900 leading-tight">

                {
                  property.title ||
                  "Premium Property"
                }

              </h1>

              {/* LOCATION */}

              <div className="flex items-center gap-2 text-slate-500 mt-3 text-sm md:text-base">

                <MapPin size={16} />

                <span>

                  {
                    property.location ||
                    "Location Not Available"
                  }

                </span>

              </div>

              {/* PRICE */}

              <div className="mt-6">

                <h2 className="text-3xl md:text-4xl font-black text-blue-700">

                  {
                    formatPrice(
                      property.price
                    )
                  }

                </h2>

              </div>

              {/* INFO GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                {/* AREA */}

                <div className="bg-slate-100 rounded-2xl p-4">

                  <p className="text-slate-500 text-sm">

                    Area

                  </p>

                  <h3 className="text-lg font-bold mt-1">

                    {
                      property.area ||
                      0
                    }
                    {" "}
                    {
                      areaUnit
                    }

                  </h3>

                </div>

                {/* TYPE */}

                <div className="bg-slate-100 rounded-2xl p-4">

                  <p className="text-slate-500 text-sm">

                    Type

                  </p>

                  <h3 className="text-lg font-bold mt-1 capitalize">

                    {
                      property.type ||
                      "Property"
                    }

                  </h3>

                </div>

                {/* STATUS */}

                <div className="bg-slate-100 rounded-2xl p-4">

                  <p className="text-slate-500 text-sm">

                    Status

                  </p>

                  <h3 className="text-lg font-bold mt-1 capitalize">

                    {
                      property.businessStatus ||
                      "Available"
                    }

                  </h3>

                </div>

                {/* PRICE / UNIT */}

                <div className="bg-slate-100 rounded-2xl p-4">

                  <p className="text-slate-500 text-sm">

                    {
                      areaUnit ===
                      "acre"
                        ? "Price/acre"
                        : "Price/sqft"
                    }

                  </p>

                  <h3 className="text-lg font-bold mt-1">

                    {
                      pricePerUnit
                    }

                  </h3>

                </div>

              </div>

              {/* VERIFIED */}

              <div className="mt-7 flex items-center gap-3 text-green-600 font-bold text-sm md:text-base">

                <ShieldCheck size={20} />

                Verified Listing

              </div>

              {/* DESCRIPTION */}

              <div className="mt-10">

                <h2 className="text-2xl md:text-3xl font-black mb-4">

                  Description

                </h2>

                <p className="text-slate-600 leading-7 text-sm md:text-base">

                  {
                    property.description ||
                    "No description available"
                  }

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="bg-white rounded-[24px] shadow-sm p-5 md:p-7 lg:sticky lg:top-5">

              <h2 className="text-2xl md:text-3xl font-black mb-6">

                Contact Seller

              </h2>

              <form className="space-y-4">

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-sm md:text-base"
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-sm md:text-base"
                />

                <input
                  type="text"
                  placeholder="City"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 text-sm md:text-base"
                />

                <textarea
                  rows="5"
                  placeholder="Message"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none resize-none focus:border-blue-500 text-sm md:text-base"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 rounded-2xl font-bold text-base"
                >

                  Submit Inquiry

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}