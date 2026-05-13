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

  // ================= FETCH =================
  const fetchProperties =
    async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/properties/approved"
        );

        const data =
          await res.json();

        setProperties(
          Array.isArray(data)
            ? data
            : []
        );

      } catch {

        setProperties([]);

      } finally {

        setLoading(false);
      }
    };

  // ================= REALTIME =================
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
    <div className="bg-slate-50 min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 md:px-12 py-20">

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          <div>

            <p className="uppercase tracking-widest text-slate-300 text-sm mb-3">
              Verified Real Estate Platform
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Find Your Dream Property
              With Confidence
            </h1>

            <p className="mt-5 text-slate-300 text-lg">
              Verified homes, flats,
              plots and commercial
              spaces from trusted
              sellers, agents and
              builders.
            </p>

            {/* SEARCH */}
            <div className="mt-8 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-lg">

              <Search className="text-slate-500" />

              <input
                type="text"
                placeholder="Search city, area or property..."
                className="flex-1 outline-none text-slate-800"
              />

              <button
                onClick={() =>
                  navigate(
                    "/properties"
                  )
                }
                className="bg-slate-900 text-white px-5 py-3 rounded-xl"
              >
                Search
              </button>

            </div>

            {/* CTA */}
            <div className="flex gap-4 mt-6 flex-wrap">

              <button
                onClick={() =>
                  navigate(
                    "/properties"
                  )
                }
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
              >
                Browse Properties
              </button>

            </div>
          </div>

          {/* RIGHT HERO */}
          <div className="bg-white/10 rounded-3xl p-8 backdrop-blur">

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white rounded-2xl p-5 text-slate-900">

                <Building2 className="mb-3" />

                <h3 className="font-bold text-2xl">
                  {properties.length}+
                </h3>

                <p>
                  Verified Listings
                </p>

              </div>

              <div className="bg-white rounded-2xl p-5 text-slate-900">

                <Users className="mb-3" />

                <h3 className="font-bold text-2xl">
                  1K+
                </h3>

                <p>
                  Happy Users
                </p>

              </div>

              <div className="bg-white rounded-2xl p-5 text-slate-900 col-span-2">

                <ShieldCheck className="mb-3 text-green-600" />

                <h3 className="font-bold text-xl">
                  100% Moderated Listings
                </h3>

                <p className="text-slate-500">
                  Fraud-resistant approval workflow
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">

        <div className="flex justify-between items-center mb-8">

          <div>

            <p className="text-slate-500 uppercase text-sm">
              Featured Listings
            </p>

            <h2 className="text-4xl font-bold">
              Explore Latest Properties
            </h2>

          </div>

          <button
            onClick={() =>
              navigate(
                "/properties"
              )
            }
            className="flex items-center gap-2 text-slate-700 font-semibold"
          >
            View All
            <ArrowRight size={18} />
          </button>

        </div>

        {loading ? (

          <div className="text-center py-20">
            Loading properties...
          </div>

        ) : properties.length === 0 ? (

          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

            <h3 className="text-2xl font-bold">
              No Properties Available
            </h3>

            <p className="text-slate-500 mt-3">
              Approved properties will appear here.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {properties
              .slice(0, 6)
              .map(
                (
                  property,
                  index
                ) => (

                  <PropertyCard
                    key={
                      property._id
                    }
                    data={
                      property
                    }
                    index={
                      index
                    }
                  />
                )
              )}

          </div>
        )}
      </section>

      {/* WHY US */}
      <section className="bg-white py-16">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          <div className="p-6 rounded-3xl bg-slate-50">

            <ShieldCheck className="text-green-600 mb-4" />

            <h3 className="text-xl font-bold">
              Verified Properties
            </h3>

            <p className="text-slate-500 mt-2">
              Every listing goes through moderation checks.
            </p>

          </div>

          <div className="p-6 rounded-3xl bg-slate-50">

            <Building2 className="text-blue-600 mb-4" />

            <h3 className="text-xl font-bold">
              Premium Inventory
            </h3>

            <p className="text-slate-500 mt-2">
              Residential and commercial options available.
            </p>

          </div>

          <div className="p-6 rounded-3xl bg-slate-50">

            <Users className="text-purple-600 mb-4" />

            <h3 className="text-xl font-bold">
              Trusted Community
            </h3>

            <p className="text-slate-500 mt-2">
              Buyers, sellers, agents and builders together.
            </p>

          </div>

        </div>
      </section>
    </div>
  );
}