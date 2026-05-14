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
  IndianRupee,
  ArrowLeft,
  ShieldCheck,
  Send,
  Hash,
  Building2,
  Phone,
  Mail,
  BadgeCheck,
} from "lucide-react";

import socket from "../../socket";

export default function PropertyDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      buyerName: "",
      buyerEmail: "",
      buyerMobile: "",
      buyerCity: "",
      message: "",
    });

  // ================= FETCH PROPERTY =================
  const fetchProperty =
    async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/properties/approved"
        );

        const data =
          await res.json();

        const found =
          data.find(
            (item) =>
              item._id === id
          );

        setProperty(
          found || null
        );

      } catch {

        setProperty(null);

      } finally {

        setLoading(false);
      }
    };

  // ================= REALTIME =================
  useEffect(() => {

    fetchProperty();

    socket.on(
      "propertyUpdated",
      () => {
        fetchProperty();
      }
    );

    return () => {

      socket.off(
        "propertyUpdated"
      );
    };

  }, [id]);

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

  // ================= PROPERTY UNIQUE ID =================
  const propertyUniqueId =
    property?.propertyUniqueId ||
    `RE-${property?._id
      ?.slice(-8)
      ?.toUpperCase()}`;

  // ================= BUSINESS STATUS =================
  const isSold =
    property?.businessStatus ===
    "sold";

  const underNegotiation =
    property?.underNegotiation;

  // ================= INPUT CHANGE =================
  const handleChange = (
    e
  ) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= SUBMIT LEAD =================
  const submitLead =
    async (e) => {

      e.preventDefault();

      if (isSold) {

        setError(
          "This property has already been sold."
        );

        return;
      }

      setSending(true);

      setSuccess("");

      setError("");

      try {

        const res = await fetch(
          "http://localhost:5000/api/leads/create",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              propertyId:
                property._id,

              buyerName:
                form.buyerName,

              buyerEmail:
                form.buyerEmail,

              buyerMobile:
                form.buyerMobile,

              buyerCity:
                form.buyerCity,

              message:
                form.message,
            }),
          }
        );

        const data =
          await res.json();

        if (res.ok) {

          setSuccess(
            "Inquiry submitted successfully 🚀"
          );

          setForm({
            buyerName: "",
            buyerEmail: "",
            buyerMobile: "",
            buyerCity: "",
            message: "",
          });

        } else {

          setError(
            data.message ||
              "Something went wrong"
          );
        }

      } catch {

        setError(
          "Server error. Please try again."
        );

      } finally {

        setSending(false);
      }
    };

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">

        Loading Property...

      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!property) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center">

        <h1 className="text-3xl font-bold mb-4">
          Property Not Found
        </h1>

        <button
          onClick={() =>
            navigate(
              "/properties"
            )
          }
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl"
        >

          Back to Properties

        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* BACK */}
        <button
          onClick={() =>
            navigate(-1)
          }
          className="flex items-center gap-2 text-slate-700 mb-6 hover:text-slate-900"
        >

          <ArrowLeft size={18} />

          Back

        </button>

        {/* IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-lg bg-white relative">

          <img
            src={
              property.image ||
              "https://via.placeholder.com/1200x600?text=Property"
            }
            alt={
              property.title
            }
            className={`w-full h-[500px] object-cover ${
              isSold
                ? "grayscale-[20%]"
                : ""
            }`}
            onError={(e) => {

              e.target.src =
                "https://via.placeholder.com/1200x600?text=Property";
            }}
          />

          {/* SOLD BADGE */}
          {isSold && (

            <div className="absolute top-6 left-6 bg-red-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl z-20">

              SOLD

            </div>
          )}

          {/* NEGOTIATION */}
          {!isSold &&
            underNegotiation && (

              <div className="absolute top-6 right-6 bg-yellow-400 text-slate-900 px-5 py-3 rounded-full text-sm font-bold shadow-xl z-20 flex items-center gap-2">

                <BadgeCheck size={18} />

                Under Negotiation

              </div>
            )}

        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROPERTY INFO */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">

              {/* VERIFIED */}
              <div className="flex items-center gap-2 text-green-600 mb-4 font-medium">

                <ShieldCheck size={18} />

                Verified Listing

              </div>

              {/* PROPERTY ID */}
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">

                <Hash size={15} />

                Property ID:
                {" "}
                <span className="font-bold tracking-wider">

                  {propertyUniqueId}

                </span>

              </div>

              {/* TITLE */}
              <h1 className="text-4xl font-bold text-slate-900">

                {property.title}

              </h1>

              {/* LOCATION */}
              <div className="flex items-center gap-2 text-slate-500 mt-4">

                <MapPin size={18} />

                {property.location}

              </div>

              {/* PRICE */}
              <div className={`flex items-center gap-2 text-3xl font-bold mt-6 ${
                isSold
                  ? "text-red-600"
                  : "text-blue-600"
              }`}>

                <IndianRupee size={28} />

                {formatPrice(
                  property.price
                )}

              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-3 mt-6">

                <div className={`px-4 py-2 rounded-full text-sm capitalize font-semibold ${
                  isSold
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>

                  {property.businessStatus ||
                    "available"}

                </div>

                {property.type && (

                  <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm capitalize">

                    {property.type}

                  </div>
                )}

                {property.subType && (

                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm capitalize">

                    {property.subType}

                  </div>
                )}

                {property.constructionStatus && (

                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm capitalize">

                    {property.constructionStatus}

                  </div>
                )}

              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <h2 className="text-2xl font-bold mb-4">
                Property Description
              </h2>

              <p className="text-slate-600 leading-8">

                {property.description ||
                  "No description available."}

              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div>

            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">

              <div className="flex items-center gap-3 mb-4">

                <Building2 className="text-slate-700" />

                <div>

                  <h2 className="text-2xl font-bold">

                    {isSold
                      ? "Property Sold"
                      : "Inquiry Form"}

                  </h2>

                  <p className="text-slate-500 text-sm">

                    {isSold
                      ? "This property is no longer accepting inquiries"
                      : "Connect with property owner"}

                  </p>

                </div>
              </div>

              {/* SOLD MESSAGE */}
              {isSold ? (

                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">

                  <div className="text-5xl mb-4">
                    🏡
                  </div>

                  <h3 className="text-2xl font-bold text-red-600 mb-3">

                    Property Sold

                  </h3>

                  <p className="text-slate-600 leading-7">

                    This property has already been sold.
                    New inquiries are currently disabled.

                  </p>

                </div>

              ) : (

                <form
                  onSubmit={
                    submitLead
                  }
                  className="space-y-4"
                >

                  <input
                    type="text"
                    name="buyerName"
                    value={
                      form.buyerName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Full Name"
                    required
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-900"
                  />

                  <input
                    type="email"
                    name="buyerEmail"
                    value={
                      form.buyerEmail
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Email Address"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-900"
                  />

                  <input
                    type="text"
                    name="buyerMobile"
                    value={
                      form.buyerMobile
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Mobile Number"
                    required
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-900"
                  />

                  <input
                    type="text"
                    name="buyerCity"
                    value={
                      form.buyerCity
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your City"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-900"
                  />

                  <textarea
                    name="message"
                    rows="5"
                    value={
                      form.message
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="I'm interested in this property..."
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-slate-900"
                  />

                  {/* SUCCESS */}
                  {success && (

                    <div className="bg-green-100 text-green-700 px-4 py-3 rounded-2xl text-sm">

                      {success}

                    </div>
                  )}

                  {/* ERROR */}
                  {error && (

                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm">

                      {error}

                    </div>
                  )}

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={
                      sending
                    }
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                  >

                    <Send size={18} />

                    {sending
                      ? "Submitting..."
                      : "Submit Inquiry"}

                  </button>
                </form>
              )}

              {/* CONTACT INFO */}
              <div className="mt-8 border-t pt-6 space-y-4">

                <div className="flex items-center gap-3 text-slate-600">

                  <Phone size={18} />

                  Verified Contact Support

                </div>

                <div className="flex items-center gap-3 text-slate-600">

                  <Mail size={18} />

                  CRM Enabled Inquiry System

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}