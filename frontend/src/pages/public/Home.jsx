import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Search,
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

import PropertyCard from "../../components/PropertyCard";
import socket from "../../socket";

export default function Home() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  // ======================================================
  // ================= FETCH PROPERTIES ===================
  // ======================================================

  const fetchProperties =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:5000/api/properties/approved"
          );

        const data =
          await res.json();

        console.log(
          "HOME API =>",
          data
        );

        // ======================================================
        // ================= FIX ================================
        // ======================================================

        let updated = [];

        // OLD ARRAY FORMAT
        if (
          Array.isArray(data)
        ) {

          updated = data;
        }

        // NEW OBJECT FORMAT
        else if (
          Array.isArray(
            data?.properties
          )
        ) {

          updated =
            data.properties;
        }

        console.log(
          "HOME FINAL =>",
          updated
        );

        setProperties(
          updated
        );

      } catch (error) {

        console.log(
          "HOME FETCH ERROR ❌",
          error
        );

        setProperties([]);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // ================= SOCKET =============================
  // ======================================================

  useEffect(() => {

    fetchProperties();

    socket.on(
      "propertyUpdated",
      () => {
        fetchProperties();
      }
    );

    return () => {

      socket.off(
        "propertyUpdated"
      );
    };

  }, []);

  return (

    <>
      {/* BACKGROUND ANIMATION */}

      <style>
        {`
          @keyframes zoomBg {

            from {
              background-size: 100%;
            }

            to {
              background-size: 110%;
            }
          }

          @keyframes headingReveal {

            from {
              opacity: 0;
              transform: translateY(40px);
              filter: blur(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }

          @keyframes typingOne {

            from {
              width: 0;
            }

            to {
              width: 100%;
            }
          }

          @keyframes typingTwo {

            from {
              width: 0;
            }

            to {
              width: 100%;
            }
          }

          .animate-heading-one {

            animation:
              headingReveal 1s ease forwards;
          }

          .animate-heading-two {

            animation:
              headingReveal 1s ease forwards;

            animation-delay: 0.5s;
          }

          .typing-line-one {

            overflow: hidden;
            white-space: nowrap;
            width: 0;

            animation:
              typingOne 3s steps(55, end) forwards;
          }

          .typing-line-two {

            overflow: hidden;
            white-space: nowrap;
            width: 0;

            animation:
              typingTwo 4s steps(75, end) forwards;

            animation-delay: 3s;

            animation-fill-mode: forwards;
          }
        `}
      </style>

      <div className="bg-slate-50 min-h-screen">

        {/* HERO SECTION */}

        <section
          className="text-white px-6 md:px-12 py-16 relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(15, 23, 42, 0.78), 
                rgba(15, 23, 42, 0.62)
              ),
              url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1974&auto=format&fit=crop")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            animation:
              "zoomBg 10s infinite alternate",
          }}
        >

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}

            <div className="-mt-8">

              <p className="uppercase tracking-[5px] text-blue-200 text-sm mb-4 font-semibold animate-pulse">

                VERIFIED REAL ESTATE PLATFORM

              </p>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight overflow-hidden">

                <span className="block animate-heading-one opacity-0">

                  Find Your Dream

                </span>

                <span className="block text-blue-300 animate-heading-two opacity-0">

                  Property With Confidence

                </span>

              </h1>

              <div className="mt-5 text-slate-200 text-lg leading-8 max-w-2xl">

                <p className="typing-line-one">

                  Verified flats, plots, villas and commercial spaces

                </p>

                <p className="typing-line-two">

                  from trusted sellers, builders and real estate professionals across India.

                </p>

              </div>

              {/* SEARCH BAR */}

              <div className="mt-8 bg-white/95 rounded-2xl p-3 flex items-center gap-3 shadow-2xl backdrop-blur-xl">

                <Search
                  className="text-slate-500 ml-2"
                  size={22}
                />

                <input
                  type="text"
                  placeholder="Search city, area or property..."
                  className="flex-1 outline-none text-slate-800 bg-transparent text-lg"
                />

                <button
                  onClick={() =>
                    navigate("/properties")
                  }
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                >

                  Search

                </button>

              </div>

              {/* CTA */}

              <div className="flex gap-4 mt-7 flex-wrap">

                <button
                  onClick={() =>
                    navigate("/properties")
                  }
                  className="bg-white text-slate-900 px-7 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
                >

                  Browse Properties

                </button>

              </div>

            </div>

            {/* RIGHT STATS */}

            <div className="bg-white/10 rounded-[32px] p-6 backdrop-blur-xl border border-white/20 shadow-2xl">

              <div className="grid grid-cols-2 gap-4">

                {/* VERIFIED */}

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">

                  <Building2
                    className="mb-3 text-blue-600"
                    size={30}
                  />

                  <h3 className="font-extrabold text-3xl">

                    {properties.length}+

                  </h3>

                  <p className="mt-1 text-slate-500 text-base">

                    Verified Listings

                  </p>

                </div>

                {/* USERS */}

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">

                  <Users
                    className="mb-3 text-purple-600"
                    size={30}
                  />

                  <h3 className="font-extrabold text-3xl">

                    1K+

                  </h3>

                  <p className="mt-1 text-slate-500 text-base">

                    Happy Users

                  </p>

                </div>

                {/* MODERATED */}

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">

                  <ShieldCheck
                    className="mb-3 text-green-600"
                    size={30}
                  />

                  <h3 className="font-bold text-3xl">

                    100%

                  </h3>

                  <p className="text-slate-500 mt-1 text-base leading-6">

                    Moderated Listings

                  </p>

                </div>

                {/* DIRECT DEALS */}

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">

                  <BadgeCheck
                    className="mb-3 text-orange-500"
                    size={30}
                  />

                  <h3 className="font-bold text-3xl">

                    Direct Deals

                  </h3>

                  <p className="text-slate-500 mt-1 text-base leading-6">

                    No brokerage for buyers

                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* FEATURED SECTION */}

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">

          <div className="flex justify-between items-center mb-10 flex-wrap gap-4">

            <div>

              <p className="text-slate-500 uppercase text-sm tracking-[4px] font-semibold">

                FEATURED LISTINGS

              </p>

              <h2 className="text-4xl md:text-5xl font-extrabold mt-2 text-slate-900">

                Explore Latest Properties

              </h2>

            </div>

            <button
              onClick={() =>
                navigate("/properties")
              }
              className="flex items-center gap-2 text-slate-700 font-semibold hover:text-blue-600 transition"
            >

              View All

              <ArrowRight size={18} />

            </button>

          </div>

          {loading ? (

            <p className="text-slate-500">

              Loading properties...

            </p>

          ) : properties.length === 0 ? (

            <p className="text-slate-500">

              No properties available.

            </p>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {properties
                .slice(0, 6)
                .map((property, index) => (

                  <PropertyCard
                    key={property._id}
                    data={property}
                    index={index}
                  />
                ))}
            </div>
          )}

        </section>

      </div>
    </>
  );
}