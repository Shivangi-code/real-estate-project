import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  ArrowLeft,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerMobile: "",
    message: "",
  });

  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/property/approved"
      );

      const data = await res.json();

      const found = data.find(
        (item) => item._id === id
      );

      setProperty(found || null);
    } catch {
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";

    if (price >= 10000000)
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;

    if (price >= 100000)
      return `₹ ${(price / 100000).toFixed(1)} L`;

    return `₹ ${price}`;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitLead = async (e) => {
    e.preventDefault();

    setSending(true);
    setSuccess("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/lead/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            propertyId: property._id,
            propertyTitle:
              property.title,
            ...form,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          "Inquiry sent successfully."
        );

        setForm({
          buyerName: "",
          buyerEmail: "",
          buyerMobile: "",
          message: "",
        });
      } else {
        setSuccess(
          data.message ||
            "Something went wrong."
        );
      }
    } catch {
      setSuccess(
        "Server error. Try again."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return <div className="p-10">Loading...</div>;

  if (!property)
    return (
      <div className="p-10">
        Property not found.
      </div>
    );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-[500px] object-cover"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <ShieldCheck size={18} />
                Verified Listing
              </div>

              <h1 className="text-4xl font-bold">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 mt-3">
                <MapPin size={18} />
                {property.location}
              </div>

              <div className="flex items-center gap-2 text-blue-600 text-3xl font-bold mt-5">
                <IndianRupee size={28} />
                {formatPrice(
                  property.price
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-3">
                  Description
                </h2>

                <p className="text-slate-600 leading-7">
                  {property.description ||
                    "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold">
                Send Inquiry
              </h2>

              <p className="text-slate-500 mt-2 mb-5">
                Interested in this
                property?
              </p>

              <form
                onSubmit={submitLead}
                className="space-y-4"
              >
                <input
                  name="buyerName"
                  value={form.buyerName}
                  onChange={
                    handleChange
                  }
                  placeholder="Your Name"
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  name="buyerEmail"
                  value={form.buyerEmail}
                  onChange={
                    handleChange
                  }
                  placeholder="Email"
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  name="buyerMobile"
                  value={
                    form.buyerMobile
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Mobile Number"
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={
                    handleChange
                  }
                  placeholder="Message"
                  rows="4"
                  className="w-full border rounded-xl px-4 py-3"
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-slate-900 text-white py-3 rounded-2xl flex justify-center items-center gap-2"
                >
                  <Send size={18} />
                  {sending
                    ? "Sending..."
                    : "Submit Inquiry"}
                </button>

                {success && (
                  <p className="text-sm text-green-600">
                    {success}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}