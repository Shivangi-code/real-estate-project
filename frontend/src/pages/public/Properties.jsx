import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  Home,
} from "lucide-react";

// ✅ CORRECT IMPORTS
import PropertyCard from "../../components/PropertyCard";

import FilterSidebar from "../../components/FilterSidebar";

// ✅ CHANGE PATH IF SOCKET INSIDE utils/
import socket from "../../socket";

export default function Properties() {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filters, setFilters] =
    useState({
      search:
        searchParams.get(
          "search"
        ) || "",

      type:
        searchParams.get(
          "type"
        ) || "",

      minPrice:
        searchParams.get(
          "minPrice"
        ) || "",

      maxPrice:
        searchParams.get(
          "maxPrice"
        ) || "",

      businessStatus:
        searchParams.get(
          "businessStatus"
        ) || "",

      underNegotiation:
        searchParams.get(
          "underNegotiation"
        ) || "",

      sort:
        searchParams.get(
          "sort"
        ) || "",
    });

  // ======================================================
  // ================= FETCH ==============================
  // ======================================================

  const fetchProperties =
    async () => {

      try {

        setLoading(true);

        const cleanFilters =
          Object.fromEntries(
            Object.entries(
              filters
            ).filter(
              ([_, value]) =>
                value !== ""
            )
          );

        const query =
          new URLSearchParams(
            cleanFilters
          ).toString();

        const res =
          await fetch(
            `http://localhost:5000/api/properties/search?${query}`
          );

        const data =
          await res.json();

        if (
          Array.isArray(data)
        ) {

          setProperties(
            data
          );

        } else {

          setProperties([]);
        }

      } catch (error) {

        console.log(
          "FETCH ERROR:",
          error
        );

        setProperties([]);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // ================= URL SYNC ===========================
  // ======================================================

  useEffect(() => {

    const cleanFilters =
      Object.fromEntries(
        Object.entries(
          filters
        ).filter(
          ([_, value]) =>
            value !== ""
        )
      );

    setSearchParams(
      cleanFilters
    );

    fetchProperties();

  }, [filters]);

  // ======================================================
  // ================= REALTIME ===========================
  // ======================================================

  useEffect(() => {

    if (!socket)
      return;

    socket.on(
      "propertyUpdated",
      fetchProperties
    );

    return () => {

      socket.off(
        "propertyUpdated",
        fetchProperties
      );
    };

  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white py-16 px-6">

        <div className="max-w-7xl mx-auto text-center">

          <div className="flex justify-center mb-5">

            <div className="bg-white/10 p-5 rounded-full">

              <Home size={40} />

            </div>

          </div>

          <h1 className="text-5xl font-bold">

            Discover Premium Properties

          </h1>

          <p className="text-blue-100 mt-5 text-lg">

            Search verified properties with advanced filters

          </p>

          {/* SEARCH */}
          <div className="max-w-3xl mx-auto mt-8 bg-white rounded-3xl p-3 flex items-center gap-3 shadow-2xl">

            <Search className="text-slate-500 ml-3" />

            <input
              type="text"
              placeholder="Search by city, title, locality..."
              value={
                filters.search
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search:
                    e.target
                      .value,
                })
              }
              className="flex-1 outline-none text-black text-lg px-2"
            />

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <div>

          <FilterSidebar
            filters={
              filters
            }
            setFilters={
              setFilters
            }
          />

        </div>

        {/* PROPERTIES */}
        <div className="lg:col-span-3">

          {/* TOP */}
          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl font-bold">

              Properties

            </h2>

            <div className="text-slate-500">

              {
                properties.length
              } results

            </div>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="bg-white rounded-3xl p-20 text-center shadow-sm">

              <h2 className="text-3xl font-bold">

                Loading properties...

              </h2>

            </div>

          ) : properties.length ===
            0 ? (

            <div className="bg-white rounded-3xl p-20 text-center shadow-sm">

              <h2 className="text-3xl font-bold">

                No Properties Found

              </h2>

              <p className="text-slate-500 mt-4">

                Try changing your filters.

              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {properties.map(
                (
                  property,
                  index
                ) => (

                  <PropertyCard
                    key={
                      property._id
                    }

                    // ✅ FIXED PROP
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

        </div>

      </div>

    </div>
  );
}