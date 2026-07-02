import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // FETCH PROPERTIES
  const fetchProperties = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/approved`);

      const data = await res.json();

      setProperties(Array.isArray(data?.properties) ? data.properties : []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    socket.on("propertyUpdated", () => {
      fetchProperties();
    });

    return () => {
      socket.off("propertyUpdated");
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
            animation: headingReveal 1s ease forwards;
          }

          .animate-heading-two {
            animation: headingReveal 1s ease forwards;
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

          /* MOBILE RESPONSIVE FIXES */

          @media (max-width: 768px) {

            .typing-line-one,
            .typing-line-two {

              white-space: normal;
              width: 100%;
              overflow: visible;
              animation: none;
            }

            .animate-heading-one,
            .animate-heading-two {

              opacity: 1;
              animation: none;
            }
          }
        `}
      </style>

      <div className="bg-slate-50 min-h-screen">
        {/* HERO SECTION */}
        <section
          className="
            text-white
            px-4 sm:px-6 md:px-12
            pt-4 pb-4 sm:py-16
            relative
            overflow-hidden
            bg-slate-900
          "
          style={{
            backgroundImage: `
              linear-gradient(
              rgba(15, 23, 42, 0.62),
              rgba(15, 23, 42, 0.52)
            ),
              url("${
                window.innerWidth < 768
                  ? "https://images.pexels.com/photos/27564710/pexels-photo-27564710.jpeg"
                  : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1974&auto=format&fit=crop"
              }")
            `,
            backgroundSize: window.innerWidth < 768 ? "cover" : "cover",
            backgroundPosition:
              window.innerWidth < 768 ? "center center" : "center center",
            backgroundRepeat: "no-repeat",
            animation: "zoomBg 10s infinite alternate",
          }}
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* LEFT CONTENT */}
            <div className="mt-0 lg:-mt-8">
              <p className="uppercase tracking-[5px] text-blue-200 text-sm mb-4 font-semibold animate-pulse">
                VERIFIED REAL ESTATE PLATFORM
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight overflow-hidden">
                <span className="block animate-heading-one opacity-0">
                  Find Your Dream
                </span>

                <span className="block text-blue-300 animate-heading-two opacity-0">
                  Property With Confidence
                </span>
              </h1>

              <div className="mt-5 text-slate-200 text-base sm:text-lg leading-7 sm:leading-8 max-w-2xl">
                <p className="typing-line-one">
                  Verified flats, plots, villas and commercial spaces
                </p>

                <p className="typing-line-two">
                  from trusted sellers, builders and real estate professionals
                  across India.
                </p>
              </div>

              {/* SEARCH BAR */}
              <div className="mt-8 bg-white/95 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-2xl backdrop-blur-xl">
                <Search className="text-slate-500 ml-2" size={22} />

                <input
                  id="search"
                  name="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/properties?search=${search}`);
                    }
                  }}
                  placeholder="Search city, area or property..."
                  className="
                    flex-1
                    outline-none
                    text-slate-800
                    bg-transparent
                    text-base
                    sm:text-lg
                    w-full
                  "
                />

                <button
                  onClick={() => {
                    if (!search.trim()) {
                      navigate("/properties");
                      return;
                    }

                    navigate(
                      `/properties?search=${encodeURIComponent(search)}`,
                    );
                  }}
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg w-full sm:w-auto"
                >
                  Search
                </button>
              </div>

              {/* CTA BUTTONS */}
              <div className="flex gap-4 mt-7 flex-wrap">
                <button
                  onClick={() => {
                    if (!search.trim()) {
                      navigate("/properties");
                      return;
                    }

                    navigate(
                      `/properties?search=${encodeURIComponent(search)}`,
                    );
                  }}
                  className="bg-white text-slate-900 px-7 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Browse Properties
                </button>
              </div>
            </div>

            {/* RIGHT STATS */}
            {/* RIGHT STATS - DESKTOP ONLY */}
            <div className="hidden lg:block bg-white/10 rounded-[32px] p-6 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {/* VERIFIED LISTINGS */}
                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">
                  <Building2 className="mb-3 text-blue-600" size={30} />

                  <h3 className="font-extrabold text-3xl">
                    {properties.length}+
                  </h3>

                  <p className="mt-1 text-slate-500 text-base">
                    Verified Listings
                  </p>
                </div>

                {/* HAPPY USERS */}
                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">
                  <Users className="mb-3 text-purple-600" size={30} />

                  <h3 className="font-extrabold text-3xl">1K+</h3>

                  <p className="mt-1 text-slate-500 text-base">Happy Users</p>
                </div>

                {/* MODERATED */}
                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">
                  <ShieldCheck className="mb-3 text-green-600" size={30} />

                  <h3 className="font-bold text-3xl">100%</h3>

                  <p className="text-slate-500 mt-1 text-base leading-6">
                    Moderated Listings
                  </p>
                </div>

                {/* DIRECT DEALS */}
                <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-xl hover:scale-105 transition-all duration-300">
                  <BadgeCheck className="mb-3 text-orange-500" size={30} />

                  <h3 className="font-bold text-3xl">Direct Deals</h3>

                  <p className="text-slate-500 mt-1 text-base leading-6">
                    No brokerage for buyers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE STATS */}
        <section className="lg:hidden bg-slate-100 px-4 py-8">
          <div className="bg-white rounded-[32px] p-5 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-3xl p-5 text-slate-900 shadow-md">
                <Building2 className="mb-3 text-blue-600" size={28} />
                <h3 className="font-extrabold text-3xl">
                  {properties.length}+
                </h3>
                <p className="mt-1 text-slate-500">Verified Listings</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 text-slate-900 shadow-md">
                <Users className="mb-3 text-purple-600" size={28} />
                <h3 className="font-extrabold text-3xl">1K+</h3>
                <p className="mt-1 text-slate-500">Happy Users</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 text-slate-900 shadow-md">
                <ShieldCheck className="mb-3 text-green-600" size={28} />
                <h3 className="font-bold text-3xl">100%</h3>
                <p className="text-slate-500 mt-1">Moderated Listings</p>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 text-slate-900 shadow-md">
                <BadgeCheck className="mb-3 text-orange-500" size={28} />
                <h3 className="font-bold text-3xl">Direct Deals</h3>
                <p className="text-slate-500 mt-1">No brokerage for buyers</p>
              </div>
            </div>
          </div>
        </section>
        {/* FEATURED SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-14 sm:py-20">
          <div className="flex justify-between items-start sm:items-center mb-8 sm:mb-10 flex-wrap gap-4">
            <div>
              <p className="text-slate-500 uppercase text-sm tracking-[4px] font-semibold">
                FEATURED LISTINGS
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 text-slate-900 leading-tight">
                Explore Latest Properties
              </h2>
            </div>

            <button
              onClick={() => navigate("/properties")}
              className="flex items-center gap-2 text-slate-700 font-semibold hover:text-blue-600 transition"
            >
              View All
              <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-slate-500">No properties available.</p>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-5
                sm:gap-7
              "
            >
              {properties.slice(0, 6).map((property, index) => (
                <PropertyCard
                  key={property._id}
                  data={property}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* WHY US */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {/* CARD 1 */}
            <div className="p-8 rounded-[28px] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300">
              <ShieldCheck className="text-green-600 mb-5" size={36} />

              <h3 className="text-2xl font-bold">Verified Properties</h3>

              <p className="text-slate-500 mt-3 leading-7">
                Every listing goes through moderation and approval checks for
                safer browsing.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="p-8 rounded-[28px] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300">
              <Building2 className="text-blue-600 mb-5" size={36} />

              <h3 className="text-2xl font-bold">Premium Inventory</h3>

              <p className="text-slate-500 mt-3 leading-7">
                Residential, luxury and commercial properties all in one
                platform.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="p-8 rounded-[28px] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300">
              <Users className="text-purple-600 mb-5" size={36} />

              <h3 className="text-2xl font-bold">Trusted Community</h3>

              <p className="text-slate-500 mt-3 leading-7">
                Buyers, sellers, agents and builders connected with
                transparency.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
