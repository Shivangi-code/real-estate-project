import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  MapPin,
  IndianRupee,
  ArrowLeft,
  ShieldCheck,
  Send,
  Hash,
  Building2,
  Phone,
  Mail,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Expand,
} from "lucide-react";

import socket from "../../socket";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const DEFAULT_IMAGE = "/default-property.jpg";

const initialForm = {
  buyerName: "",
  buyerEmail: "",
  buyerMobile: "",
  buyerCity: "",
  message: "",
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const [fullscreen, setFullscreen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // ======================================================
  // ================= FETCH PROPERTY =====================
  // ======================================================

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/properties/${id}`);

      if (!res.ok) {
        setProperty(null);
        return;
      }

      const data = await res.json();

      const propertyData = data?.property || data?.data || data;

      setProperty(propertyData?._id ? propertyData : null);
    } catch (err) {
      console.log("PROPERTY FETCH ERROR:", err);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ================= REALTIME ===========================
  // ======================================================

  useEffect(() => {
    fetchProperty();

    const refreshProperty = () => fetchProperty();

    socket.on("propertyUpdated", refreshProperty);

    return () => {
      socket.off("propertyUpdated", refreshProperty);
    };
  }, [id]);

  // ======================================================
  // ================= DERIVED DATA =======================
  // ======================================================

  const images = useMemo(() => {
    if (property?.images?.length) {
      return property.images.map((img) =>
        typeof img === "string" ? img : img?.url
      );
    }

    return property?.image ? [property.image] : [DEFAULT_IMAGE];
  }, [property]);

  const propertyUniqueId =
    property?.propertyUniqueId ||
    `RE-${property?._id?.slice(-8)?.toUpperCase()}`;

  const isSold = property?.businessStatus === "sold";

  const underNegotiation = property?.underNegotiation;

  const propertyStatus = property?.businessStatus || "available";

  const areaLabel = property?.area
    ? `${property.area} ${property.areaUnit || "sqft"}`
    : "N/A";

  const pricePerUnit =
    property?.price && property?.area
      ? Math.round(property.price / property.area)
      : 0;

  const propertyHighlights = [
    property?.type && `${property.type} Property`,
    property?.subType,
    property?.constructionStatus,
    property?.area && `Spacious ${areaLabel}`,
    property?.location && "Prime Location",
  ].filter(Boolean);

  // ======================================================
  // ================= HELPERS ============================
  // ======================================================

  const formatPrice = (price) => {
    if (!price) return "N/A";

    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(1)} L`;
    }

    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const nextImage = () =>
    setActiveImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const imageErrorHandler = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  // ======================================================
  // ================= SUBMIT LEAD ========================
  // ======================================================

  const submitLead = async (e) => {
    e.preventDefault();

    if (isSold) {
      setError("This property has already been sold.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_URL}/api/leads/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: property?._id,
          propertyTitle: property?.title,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Something went wrong");
        return;
      }

      setSuccess("Inquiry submitted successfully 🚀");
      setForm(initialForm);
    } catch {
      setError("Server error");
    } finally {
      setSending(false);
    }
  };

  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-xl font-bold">
        Loading Property...
      </div>
    );
  }

  // ======================================================
  // ================= NOT FOUND ==========================
  // ======================================================

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>

        <button
          onClick={() => navigate("/properties")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* ====================================================== */}
      {/* ================= FULLSCREEN ========================= */}
      {/* ====================================================== */}

      {fullscreen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-20"
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-5 bg-white/20 hover:bg-white/30 text-white p-3 sm:p-4 rounded-full z-20"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-5 bg-white/20 hover:bg-white/30 text-white p-3 sm:p-4 rounded-full z-20"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <img
            src={images?.[activeImage] || DEFAULT_IMAGE}
            alt={property?.title || "property"}
            onError={imageErrorHandler}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-2xl"
          />
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 overflow-x-hidden">
        {/* BACK */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 bg-white px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
          {/* ====================================================== */}
          {/* ================= LEFT =============================== */}
          {/* ====================================================== */}

          <div className="lg:col-span-2 min-w-0 w-full">
            {/* MAIN IMAGE */}

            <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl bg-white h-[260px] sm:h-[380px] md:h-[460px] lg:h-[500px]">
              <img
                src={images?.[activeImage] || DEFAULT_IMAGE}
                alt={property?.title || "property"}
                onError={imageErrorHandler}
                className="w-full h-full object-cover object-center"
              />

              <button
                onClick={() => setFullscreen(true)}
                className="absolute top-5 right-5 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
              >
                <Expand size={22} />
              </button>

              {isSold && (
                <div className="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  SOLD
                </div>
              )}

              {!isSold && underNegotiation && (
                <div className="absolute bottom-5 left-5 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <BadgeCheck size={16} />
                  Under Negotiation
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                  >
                    <ChevronLeft size={26} />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full max-w-full">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-[70px] h-[60px] sm:w-[110px] sm:h-[85px] rounded-2xl overflow-hidden border-4 transition ${
                      activeImage === index
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img || DEFAULT_IMAGE}
                      alt="thumb"
                      onError={imageErrorHandler}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* DETAILS */}

            <div className="bg-white rounded-[24px] sm:rounded-[32px] shadow-sm p-5 sm:p-8 mt-5 sm:mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Hash size={15} />
                <span className="font-semibold tracking-widest">
                  {propertyUniqueId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {property?.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 mt-4 text-lg">
                <MapPin size={18} />
                {property?.location}
              </div>

              <div className="flex items-center gap-3 mt-6 text-blue-700">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {formatPrice(property?.price)}
                </span>
              </div>

              {/* TAGS */}

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  {
                    value: property?.type,
                    className: "bg-blue-100 text-blue-700",
                  },
                  {
                    value: property?.subType,
                    className: "bg-indigo-100 text-indigo-700",
                  },
                  {
                    value: property?.constructionStatus,
                    className: "bg-green-100 text-green-700",
                  },
                ].map(
                  (item, index) =>
                    item?.value && (
                      <div
                        key={index}
                        className={`${item.className} px-4 py-2 rounded-full font-semibold`}
                      >
                        {item.value}
                      </div>
                    )
                )}
              </div>

              <div className="flex items-center gap-2 mt-6 text-green-700 font-semibold">
                <ShieldCheck size={18} />
                Verified Listing
              </div>

              {/* INFO GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-8">
                {[
                  {
                    label: "Area",
                    value: areaLabel,
                  },
                  {
                    label: `Price/${property?.areaUnit || "sqft"}`,
                    value:
                      pricePerUnit > 0
                        ? `₹ ${pricePerUnit.toLocaleString("en-IN")}`
                        : "N/A",
                  },
                  {
                    label: "Property Status",
                    value: propertyStatus,
                    className:
                      propertyStatus === "sold"
                        ? "text-red-600"
                        : propertyStatus === "available"
                        ? "text-green-600"
                        : "text-yellow-600",
                  },
                  {
                    label: "Construction",
                    value: property?.constructionStatus || "N/A",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5"
                  >
                    <span className="text-sm text-slate-500 font-medium">
                      {item.label}
                    </span>

                    <h3
                      className={`text-lg sm:text-xl font-bold mt-2 capitalize ${
                        item?.className || "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>

              {/* HIGHLIGHTS */}

              {!!propertyHighlights.length && (
                <div className="mt-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                    Property Highlights
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {propertyHighlights.map((item, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm sm:text-base font-semibold"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>

                <p className="text-slate-600 leading-7 sm:leading-8 text-base sm:text-lg">
                  {property?.description}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================== */}
          {/* ================= RIGHT ============================== */}
          {/* ====================================================== */}

          <div className="min-w-0 w-full">
            <div className="w-full max-w-full overflow-hidden bg-white rounded-[24px] sm:rounded-[32px] shadow-sm p-4 sm:p-8 lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-blue-700" />

                <h2 className="text-xl sm:text-2xl font-bold">
                  Inquiry Form
                </h2>
              </div>

              {success && (
                <div className="bg-green-100 text-green-700 px-4 py-3.5 rounded-2xl mb-5">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3.5 rounded-2xl mb-5">
                  {error}
                </div>
              )}

              {isSold ? (
                <div className="bg-red-100 text-red-700 p-5 rounded-2xl font-semibold">
                  This property has already been sold.
                </div>
              ) : (
                <form onSubmit={submitLead} className="space-y-5 w-full">
                  {[
                    {
                      label: "Full Name",
                      name: "buyerName",
                      type: "text",
                    },
                    {
                      label: "Email",
                      name: "buyerEmail",
                      type: "email",
                      icon: <Mail size={16} />,
                    },
                    {
                      label: "Mobile Number",
                      name: "buyerMobile",
                      type: "text",
                      icon: <Phone size={16} />,
                    },
                    {
                      label: "City",
                      name: "buyerCity",
                      type: "text",
                    },
                  ].map((field, index) => (
                    <div key={index} className="w-full min-w-0">
                      <label className="font-semibold mb-2 flex items-center gap-2">
                        {field.icon}
                        {field.label}
                      </label>

                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                        className="w-full max-w-full min-w-0 border border-slate-300 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  <div className="w-full min-w-0">
                    <label className="font-semibold mb-2 block">
                      Message
                    </label>

                    <textarea
                      rows="5"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full max-w-full min-w-0 border border-slate-300 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full max-w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition ${
                      sending
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <Send size={20} />
                    {sending ? "Submitting..." : "Submit Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}