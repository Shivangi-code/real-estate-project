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
import heroBg from "../../assets/hero-bg.png";

export default function Home() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

const [listingCount, setListingCount] = useState(0);
const [userCount, setUserCount] = useState(0);
const [verifyCount, setVerifyCount] = useState(0);
const [brokerCount, setBrokerCount] = useState(0);
  const navigate = useNavigate();

  // FETCH PROPERTIES
  const fetchProperties = async () => {

    try {

      const res = await fetch(
        "http://localhost:5000/api/properties/approved"
      );

      const data = await res.json();

      setProperties(

        Array.isArray(data?.properties)
          ? data.properties
          : []
      );

    } catch {

      setProperties([]);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchProperties();

    socket.on(
      "propertyUpdated",
      () => {
        fetchProperties();
      }
    );

    return () => {
      socket.off("propertyUpdated");
    };

  }, []);

  return (

    <>
      {/* BACKGROUND ANIMATION */}
      <style>
        {`
          

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
              @keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes floatGlow {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-25px);
  }
}
          }
@keyframes goldBorder {

  0% {
    border-color: rgba(212,175,55,.15);
  }

  50% {
    border-color: rgba(245,217,122,.9);
    box-shadow: 0 0 25px rgba(212,175,55,.25);
  }

  100% {
    border-color: rgba(212,175,55,.15);
  }
}

.stat-card{
  animation: goldBorder 3s ease-in-out infinite;
}
        `}
      </style>

      <div className="bg-slate-50 min-h-screen">

        {/* HERO SECTION */}
        <section
  className="
    relative
    min-h-screen
    flex
    items-center
    overflow-hidden
    text-white
    px-4
    sm:px-6
    md:px-12
  "
  style={{
    backgroundImage: `url(${heroBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div
  className="absolute inset-0"
  style={{
    background:
      "linear-gradient(rgba(8,20,35,0.72), rgba(8,20,35,0.60))",
  }}
/>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-16 items-center">

            {/* LEFT CONTENT */}
            <div className="mt-4 lg:mt-0 max-w-[620px]">

              <p className="uppercase tracking-[4px] text-blue-200 text-[11px] sm:text-sm mb-3 sm:mb-4 font-semibold animate-pulse">
                VERIFIED REAL ESTATE PLATFORM
              </p>

              <h1 className="text-2xl sm:text-3xl md:text-[42px] lg:text-[52px] font-black leading-[1.1] tracking-[-1px]">
                <span className="block animate-heading-one opacity-0 mb-1">
  Discover Your Future
</span>

<span className="block text-[#D4AF37] animate-heading-two opacity-0">
  Find The Perfect Property
</span>

              </h1>

              <div className="mt-4 text-slate-200 text-sm sm:text-lg leading-6 sm:leading-8 max-w-2xl">

                <p className="typing-line-one">
                  Verified flats, plots, villas and commercial spaces
                </p>

                <p className="typing-line-two">
                  from trusted sellers, builders and real estate professionals across India.
                </p>

              </div>
              

              {/* SEARCH BAR */}
              <div className="mt-8 bg-white/10 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-2xl w-full max-w-xl">

                <div className="flex items-center gap-2">

  <Search
  className="text-[#D4AF37] ml-3"
  size={18}
/>

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
      text-white
      placeholder:text-slate-300
      bg-transparent
      text-[14px]
      sm:text-lg
      w-full
      px-1
      py-0.5
    "
  />

</div>

                <button
                  onClick={() => {

                    if (!search.trim()) {
                      navigate("/properties");
                      return;
                    }

                    navigate(
                      `/properties?search=${encodeURIComponent(search)}`
                    );
                  }}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] text-[#0B2345] px-7 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(212,175,55,.45)] active:scale-95"
                >
                  Search
                </button>
              </div>

              {/* CTA BUTTONS */}
              <div className="flex mt-5 sm:mt-7 justify-center sm:justify-start">

                <button
  onClick={() => {
    navigate("/properties");
  }}
  className="bg-white text-slate-900 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl text-sm w-fit"
>
  Browse Properties
</button>

              </div>
            </div>

           {/* RIGHT STATS */}
<div className="hidden lg:flex items-center justify-center">

  <div className="grid grid-cols-2 gap-8">

    {/* CARD 1 */}
    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-2xl px-5 py-4 w-[260px]">

      <div className="w-16 h-16 rounded-xl border border-[#D4AF37]/60 flex items-center justify-center">
        <Building2 size={28} className="text-[#D4AF37]" />
      </div>

      <div className="w-px h-12 bg-[#D4AF37]/30" />

      <div>
        <h2 className="text-3xl font-bold text-white">10+</h2>
        <p className="text-sm text-white/80">Verified Listings</p>
      </div>

    </div>

    {/* CARD 2 */}
    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-2xl px-5 py-4 w-[260px]">

      <div className="w-16 h-16 rounded-xl border border-[#D4AF37]/60 flex items-center justify-center">
        <Users size={28} className="text-[#D4AF37]" />
      </div>

      <div className="w-px h-12 bg-[#D4AF37]/30" />

      <div>
        <h2 className="text-3xl font-bold text-white">1K+</h2>
        <p className="text-sm text-white/80">Happy Users</p>
      </div>

    </div>

    {/* CARD 3 */}
    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-2xl px-5 py-4 w-[260px]">

      <div className="w-16 h-16 rounded-xl border border-[#D4AF37]/60 flex items-center justify-center">
        <ShieldCheck size={28} className="text-[#D4AF37]" />
      </div>

      <div className="w-px h-12 bg-[#D4AF37]/30" />

      <div>
        <h2 className="text-3xl font-bold text-white">100%</h2>
        <p className="text-sm text-white/80">Verified</p>
      </div>

    </div>

    {/* CARD 4 */}
    <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-2xl px-5 py-4 w-[260px]">

      <div className="w-16 h-16 rounded-xl border border-[#D4AF37]/60 flex items-center justify-center">
        <BadgeCheck size={28} className="text-[#D4AF37]" />
      </div>

      <div className="w-px h-12 bg-[#D4AF37]/30" />

      <div>
        <h2 className="text-3xl font-bold text-white">0%</h2>
        <p className="text-sm text-white/80">Brokerage</p>
      </div>

    </div>

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

        {/* WHY US */}
        <section className="bg-white py-20">

          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

            {/* CARD 1 */}
            <div className="p-8 rounded-[28px] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300">

              <ShieldCheck
                className="text-green-600 mb-5"
                size={36}
              />

              <h3 className="text-2xl font-bold">
                Verified Properties
              </h3>

              <p className="text-slate-500 mt-3 leading-7">
                Every listing goes through moderation
                and approval checks for safer browsing.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="p-8 rounded-[28px] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300">

              <Building2
                className="text-blue-600 mb-5"
                size={36}
              />

              <h3 className="text-2xl font-bold">
                Premium Inventory
              </h3>

              <p className="text-slate-500 mt-3 leading-7">
                Residential, luxury and commercial
                properties all in one platform.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="p-8 rounded-[28px] bg-slate-50 shadow-sm hover:shadow-xl transition-all duration-300">

              <Users
                className="text-purple-600 mb-5"
                size={36}
              />

              <h3 className="text-2xl font-bold">
                Trusted Community
              </h3>

              <p className="text-slate-500 mt-3 leading-7">
                Buyers, sellers, agents and builders
                connected with transparency.
              </p>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}