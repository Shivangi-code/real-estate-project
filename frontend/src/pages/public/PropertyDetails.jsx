import { useEffect, useState } from "react";

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

export default function PropertyDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // ======================================================
  // ================= GALLERY ============================
  // ======================================================

  const [activeImage, setActiveImage] = useState(0);

  const [fullscreen, setFullscreen] = useState(false);

  // ======================================================
  // ================= FORM ===============================
  // ======================================================

  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerMobile: "",
    buyerCity: "",
    message: "",
  });

  // ======================================================
  // ================= FETCH PROPERTY =====================
  // ======================================================

  const fetchProperty = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`);

      const data = await res.json();

      setProperty(data);
    } catch {
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

    socket.on("propertyUpdated", () => {
      fetchProperty();
    });

    return () => {
      socket.off("propertyUpdated");
    };
  }, [id]);

  // ======================================================
  // ================= FORMAT PRICE =======================
  // ======================================================

  const formatPrice = (price) => {
    if (!price) return "N/A";

    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(1)} L`;
    }

    return `₹ ${price}`;
  };

  // ======================================================
  // ================= IMAGES =============================
  // ======================================================

  const images =
    property?.images?.length > 0
      ? property.images.map((img) => (typeof img === "string" ? img : img.url))
      : property?.image
        ? [property.image]
        : ["https://via.placeholder.com/1200x700?text=Property"];
  // ======================================================
  // ================= STATUS =============================
  // ======================================================

  const propertyUniqueId =
    property?.propertyUniqueId ||
    `RE-${property?._id?.slice(-8)?.toUpperCase()}`;

  const isSold = property?.businessStatus === "sold";

  const underNegotiation = property?.underNegotiation;

  // ======================================================
  // ================= INPUT CHANGE =======================
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

    setSending(true);

    setSuccess("");

    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/leads/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          propertyId: property._id,

          propertyTitle: property.title,

          buyerName: form.buyerName,

          buyerEmail: form.buyerEmail,

          buyerMobile: form.buyerMobile,

          buyerCity: form.buyerCity,

          message: form.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Inquiry submitted successfully 🚀");

        setForm({
          buyerName: "",
          buyerEmail: "",
          buyerMobile: "",
          buyerCity: "",
          message: "",
        });
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Server error");
    } finally {
      setSending(false);
    }
  };

  // ======================================================
  // ================= GALLERY CONTROLS ===================
  // ======================================================

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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
  console.log("PROPERTY", property);
  console.log("IMAGES", images);

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* ====================================================== */}
      {/* ================= FULLSCREEN ========================= */}
      {/* ====================================================== */}

      {fullscreen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          {/* CLOSE */}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-20"
          >
            <X size={28} />
          </button>

          {/* PREV */}
          <button
            onClick={prevImage}
            className="absolute left-5 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full z-20"
          >
            <ChevronLeft size={32} />
          </button>

          {/* IMAGE */}
          <img
            src={
              images[activeImage] ||
              "https://via.placeholder.com/1200x700?text=Property"
            }
            alt={property.title}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/1200x700?text=Property";
            }}
            className="w-full h-[500px] object-cover"
          />

          {/* NEXT */}
          <button
            onClick={nextImage}
            className="absolute right-5 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full z-20"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}

      {/* ====================================================== */}
      {/* ================= HERO GALLERY ======================= */}
      {/* ====================================================== */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 bg-white px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ====================================================== */}
          {/* ================= LEFT =============================== */}
          {/* ====================================================== */}

          <div className="lg:col-span-2">
            {/* MAIN IMAGE */}
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-black group">
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-[500px] object-cover"
              />

              {/* EXPAND */}
              <button
                onClick={() => setFullscreen(true)}
                className="absolute top-5 right-5 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition"
              >
                <Expand size={22} />
              </button>

              {/* SOLD */}
              {isSold && (
                <div className="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  SOLD
                </div>
              )}

              {/* NEGOTIATION */}
              {!isSold && underNegotiation && (
                <div className="absolute bottom-5 left-5 bg-yellow-400 text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <BadgeCheck size={16} />
                  Under Negotiation
                </div>
              )}

              {/* PREV */}
              {images.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                >
                  <ChevronLeft size={26} />
                </button>
              )}

              {/* NEXT */}
              {images.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
                >
                  <ChevronRight size={26} />
                </button>
              )}
            </div>

            {/* ====================================================== */}
            {/* ================= THUMBNAILS ========================= */}
            {/* ====================================================== */}

            {images.length > 1 && (
              <div className="flex gap-4 mt-5 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`min-w-[110px] h-[85px] rounded-2xl overflow-hidden border-4 transition ${
                      activeImage === index
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* ====================================================== */}
            {/* ================= DETAILS ============================ */}
            {/* ====================================================== */}

            <div className="bg-white rounded-[32px] shadow-sm p-8 mt-6">
              {/* PROPERTY ID */}
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Hash size={15} />

                <span className="font-semibold tracking-widest">
                  {propertyUniqueId}
                </span>
              </div>

              {/* TITLE */}
              <h1 className="text-4xl font-bold">{property.title}</h1>

              {/* LOCATION */}
              <div className="flex items-center gap-2 text-slate-500 mt-4 text-lg">
                <MapPin size={18} />

                {property.location}
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-3 mt-6 text-blue-700">
                <IndianRupee size={28} />

                <span className="text-4xl font-bold">
                  {formatPrice(property.price)}
                </span>
              </div>

              {/* TYPE */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  {property.type}
                </div>

                <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold">
                  {property.subType}
                </div>

                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  {property.constructionStatus}
                </div>
              </div>

              {/* VERIFIED */}
              <div className="flex items-center gap-2 mt-6 text-green-700 font-semibold">
                <ShieldCheck size={18} />
                Verified Listing
              </div>

              {/* DESCRIPTION */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>

                <p className="text-slate-600 leading-8 text-lg">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================== */}
          {/* ================= RIGHT ============================== */}
          {/* ====================================================== */}

          <div>
            {/* CONTACT CARD */}
            <div className="bg-white rounded-[32px] shadow-sm p-8 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-blue-700" />

                <h2 className="text-2xl font-bold">Inquiry Form</h2>
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-2xl mb-5">
                  {success}
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl mb-5">
                  {error}
                </div>
              )}

              {/* SOLD */}
              {isSold && (
                <div className="bg-red-100 text-red-700 p-5 rounded-2xl mb-6 font-semibold">
                  This property has already been sold.
                </div>
              )}

              {/* FORM */}
              {!isSold && (
                <form onSubmit={submitLead} className="space-y-5">
                  {/* NAME */}
                  <div>
                    <label className="font-semibold mb-2 block">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="buyerName"
                      value={form.buyerName}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="font-semibold mb-2 flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </label>

                    <input
                      type="email"
                      name="buyerEmail"
                      value={form.buyerEmail}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* MOBILE */}
                  <div>
                    <label className="font-semibold mb-2 flex items-center gap-2">
                      <Phone size={16} />
                      Mobile Number
                    </label>

                    <input
                      type="text"
                      name="buyerMobile"
                      value={form.buyerMobile}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="font-semibold mb-2 block">City</label>

                    <input
                      type="text"
                      name="buyerCity"
                      value={form.buyerCity}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="font-semibold mb-2 block">Message</label>

                    <textarea
                      rows="5"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition ${
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
