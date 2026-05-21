import {
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

import "../styles/Contact.css";

function Contact() {

  const [form, setForm] =
    useState({
      buyerName: "",
      buyerEmail: "",
      buyerMobile: "",
      buyerCity: "",
      message: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e
  ) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      setSuccess("");

      setError("");

      try {

        const res = await fetch(
          "http://localhost:5000/api/leads/contact-us",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              form
            ),
          }
        );

        const data =
          await res.json();

        if (res.ok) {

          setSuccess(
            "Message submitted successfully 🚀"
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
              "Failed to send message"
          );
        }

      } catch (err) {

        console.log(err);

        setError(
          "Server error. Please try again."
        );

      } finally {

        setLoading(false);

        setTimeout(() => {

          setSuccess("");

          setError("");

        }, 4000);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20 px-6">

        <div className="max-w-6xl mx-auto text-center">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <p className="uppercase tracking-[6px] text-slate-300 text-sm mb-5">

              CRM Connected Support

            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">

              Contact Our Team

            </h1>

            <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">

              Connect with our verified real estate support team
              for inquiries, partnerships and property assistance.

            </p>

          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT INFO */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="space-y-6"
          >

            {/* CARD */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-5">

                <Building2 className="text-slate-700" />

                <h2 className="text-3xl font-bold">
                  Contact Information
                </h2>

              </div>

              <div className="space-y-6">

                <div className="flex items-start gap-4">

                  <div className="bg-slate-100 p-3 rounded-2xl">

                    <Mail className="text-slate-700" />

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Email Support
                    </p>

                    <h3 className="font-semibold text-lg">
                      housifyrealty.info@gmail.com
                    </h3>

                  </div>
                </div>

                <div className="flex items-start gap-4">

                  <div className="bg-slate-100 p-3 rounded-2xl">

                    <Phone className="text-slate-700" />

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Phone
                    </p>

                    <h3 className="font-semibold text-lg">
                      7415930089
                    </h3>

                  </div>
                </div>

                <div className="flex items-start gap-4">

                  <div className="bg-slate-100 p-3 rounded-2xl">

                    <MapPin className="text-slate-700" />

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Office Address
                    </p>

                    <h3 className="font-semibold text-lg">
                      India
                    </h3>

                  </div>
                </div>

              </div>
            </div>

            {/* FEATURES */}
            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-white rounded-3xl p-6 shadow-sm">

                <ShieldCheck className="text-green-600 mb-4" />

                <h3 className="font-bold text-xl">
                  Verified Support
                </h3>

                <p className="text-slate-500 mt-2 text-sm leading-6">

                  Trusted real estate inquiry management.

                </p>

              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm">

                <MessageSquare className="text-blue-600 mb-4" />

                <h3 className="font-bold text-xl">
                  CRM Integrated
                </h3>

                <p className="text-slate-500 mt-2 text-sm leading-6">

                  Realtime lead tracking and response workflow.

                </p>

              </div>

            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <div className="mb-6">

                <p className="uppercase tracking-widest text-sm text-slate-500">

                  Contact Lead Form

                </p>

                <h2 className="text-4xl font-bold mt-2">

                  Send Us A Message

                </h2>

              </div>

              {/* SUCCESS */}
              {success && (

                <div className="bg-green-100 text-green-700 px-5 py-4 rounded-2xl mb-5">

                  {success}

                </div>
              )}

              {/* ERROR */}
              {error && (

                <div className="bg-red-100 text-red-700 px-5 py-4 rounded-2xl mb-5">

                  {error}

                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={
                  handleSubmit
                }
                className="space-y-5"
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
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-slate-900"
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
                  required
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-slate-900"
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
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-slate-900"
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
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-slate-900"
                />

                <textarea
                  name="message"
                  rows="6"
                  value={
                    form.message
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Write your message..."
                  required
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-slate-900 resize-none"
                />

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                >

                  <Send size={18} />

                  {loading
                    ? "Submitting..."
                    : "Send Message"}

                </button>

              </form>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default Contact;