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

        let updated = [];

        if (
          Array.isArray(data)
        ) {

          updated = data;
        }

        else if (
          Array.isArray(
            data?.properties
          )
        ) {

          updated =
            data.properties;
        }

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
      {/* ====================================================== */}
      {/* ================= ANIMATIONS ========================= */}
      {/* ====================================================== */}

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

          .animate-heading-one {

            animation:
              headingReveal 1s ease forwards;
          }

          .animate-heading-two {

            animation:
              headingReveal 1s ease forwards;

            animation-delay: 0.4s;
          }
        `}
      </style>

      <div className="bg-slate-50 min-h-screen overflow-x-hidden">

        {/* ====================================================== */}
        {/* ================= HERO SECTION ======================= */}
        {/* ====================================================== */}

        <section
          className="text-white px-4 sm:px-6 lg:px-10 py-8 md:py-12 relative overflow-hidden"
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

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center min-h-[78vh]">

            {/* LEFT */}

            <div>

              <p className="uppercase tracking-[4px] text-blue-200 text-xs sm:text-sm mb-4 font-semibold">

                VERIFIED REAL ESTATE PLATFORM

              </p>

              <h1 className="font-extrabold leading-tight overflow-hidden">

                <span className="block animate-heading-one opacity-0 text-4xl sm:text-5xl md:text-[5rem]">

                  Find Your Dream

                </span>

                <span className="block text-blue-300 animate-heading-two opacity-0 text-4xl sm:text-5xl md:text-[5rem]">

                  Property With Confidence

                </span>

              </h1>

              <div className="mt-5 text-slate-200 text-base md:text-lg leading-7 max-w-2xl">

                <p>
                  Verified flats, plots, villas and commercial spaces
                </p>

                <p>
                  from trusted sellers, builders and real estate professionals across India.
                </p>

              </div>

              {/* SEARCH */}

              <div className="mt-8 bg-white/95 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-2xl backdrop-blur-xl">

                <div className="flex items-center gap-3 flex-1">

                  <Search
                    className="text-slate-500 ml-2"
                    size={22}
                  />

                  <input
                    type="text"
                    placeholder="Search city, area or property..."
                    className="flex-1 outline-none text-slate-800 bg-transparent text-sm md:text-base"
                  />

                </div>

                <button
                  onClick={() =>
                    navigate("/properties")
                  }
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg w-full sm:w-auto"
                >

                  Search

                </button>

              </div>

            </div>

            {/* RIGHT STATS */}

            <div className="bg-white/10 rounded-[28px] p-4 sm:p-5 backdrop-blur-xl border border-white/20 shadow-2xl">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl">

                  <Building2
                    className="mb-3 text-blue-600"
                    size={28}
                  />

                  <h3 className="font-extrabold text-3xl">

                    {properties.length}+

                  </h3>

                  <p className="mt-1 text-slate-500 text-sm md:text-base">

                    Verified Listings

                  </p>

                </div>

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl">

                  <Users
                    className="mb-3 text-purple-600"
                    size={28}
                  />

                  <h3 className="font-extrabold text-3xl">

                    1K+

                  </h3>

                  <p className="mt-1 text-slate-500 text-sm md:text-base">

                    Happy Users

                  </p>

                </div>

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl">

                  <ShieldCheck
                    className="mb-3 text-green-600"
                    size={28}
                  />

                  <h3 className="font-bold text-3xl">

                    100%

                  </h3>

                  <p className="text-slate-500 mt-1 text-sm md:text-base">

                    Moderated Listings

                  </p>

                </div>

                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl">

                  <BadgeCheck
                    className="mb-3 text-orange-500"
                    size={28}
                  />

                  <h3 className="font-bold text-2xl md:text-3xl">

                    Direct Deals

                  </h3>

                  <p className="text-slate-500 mt-1 text-sm md:text-base">

                    No brokerage for buyers

                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================== */}
        {/* ================= FEATURED PROPERTIES ================ */}
        {/* ====================================================== */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          <div className="flex justify-between items-start md:items-center mb-10 flex-col md:flex-row gap-4">

            <div>

              <p className="text-slate-500 uppercase text-xs md:text-sm tracking-[4px] font-semibold">

                FEATURED LISTINGS

              </p>

              <h2 className="text-3xl md:text-5xl font-extrabold mt-2 text-slate-900 leading-tight">

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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

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