import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  Building2,
  IndianRupee,
} from "lucide-react";

import { TypeAnimation } from "react-type-animation";

import PropertyCard from "../../components/PropertyCard";

import socket from "../../socket";

export default function Properties() {

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState(
      searchParams.get("search") || ""
    );

  const [type, setType] =
    useState(
      searchParams.get("type") || ""
    );

  const [maxPrice, setMaxPrice] =
    useState(
      searchParams.get("maxPrice") || ""
    );

  const [sort, setSort] =
    useState(
      searchParams.get("sort") || ""
    );

  // ======================================================
  // ================= UPDATE URL =========================
  // ======================================================

  useEffect(() => {

    const params = {};

    if (search)
      params.search = search;

    if (type)
      params.type = type;

    if (maxPrice)
      params.maxPrice = maxPrice;

    if (sort)
      params.sort = sort;

    setSearchParams(params);

  }, [
    search,
    type,
    maxPrice,
    sort,
    setSearchParams,
  ]);

  // ======================================================
  // ================= FETCH PROPERTIES ===================
  // ======================================================

  const fetchProperties =
    async () => {

      try {

        setLoading(true);

        const params =
          new URLSearchParams();

        if (search) {

          params.append(
            "search",
            search
          );
        }

        if (type) {

          params.append(
            "type",
            type
          );
        }

        if (maxPrice) {

          params.append(
            "maxPrice",
            maxPrice
          );
        }

        // ================= API =================

        const res =
          await fetch(
            `http://localhost:5000/api/properties/approved?${params.toString()}`
          );

        const data =
          await res.json();

        console.log(
          "PROPERTIES API =>",
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

        // ======================================================
        // ================= SORT ===============================
        // ======================================================

        if (
          sort === "low-high"
        ) {

          updated.sort(
            (a, b) =>
              Number(a.price) -
              Number(b.price)
          );
        }

        if (
          sort === "high-low"
        ) {

          updated.sort(
            (a, b) =>
              Number(b.price) -
              Number(a.price)
          );
        }

        console.log(
          "FINAL PROPERTIES =>",
          updated
        );

        setProperties(
          updated
        );

      } catch (error) {

        console.log(
          "Fetch Error ❌",
          error
        );

        setProperties([]);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // ================= FETCH EFFECT =======================
  // ======================================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        fetchProperties();

      }, 400);

    return () =>
      clearTimeout(timer);

  }, [
    search,
    type,
    maxPrice,
    sort,
  ]);

  // ======================================================
  // ================= REALTIME ===========================
  // ======================================================

  useEffect(() => {

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

  // ======================================================
  // ================= UI ================================
  // ======================================================

  return (

    <div className="bg-slate-50 min-h-screen">

      {/* HERO */}

      <section
        className="text-white px-6 md:px-10 py-24 relative overflow-hidden"
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
        }}
      >

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="max-w-4xl">

            <p className="uppercase tracking-[6px] text-blue-200 text-sm font-semibold mb-5">

              VERIFIED MARKETPLACE

            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              <span className="text-white">

                Find Your Perfect

              </span>

              <br />

              <span className="bg-gradient-to-r from-blue-200 via-white to-cyan-300 bg-clip-text text-transparent">

                Property

              </span>

            </h1>

            <div className="mt-8 text-xl md:text-2xl text-slate-200 leading-10 font-light max-w-3xl">

              <TypeAnimation
                sequence={[
                  "Browse verified luxury homes across India.",
                  2000,
                  "Explore premium commercial investments.",
                  2000,
                  "Discover properties with complete trust.",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />

            </div>

          </div>

        </div>

      </section>

      {/* FILTER BAR */}

      <section className="max-w-7xl mx-auto px-6 md:px-10 -mt-12 relative z-20">

        <div className="bg-white rounded-3xl shadow-xl p-5 grid lg:grid-cols-4 gap-4">

          {/* SEARCH */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3">

            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              type="text"
              placeholder="Search city or property"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full outline-none"
            />

          </div>

          {/* TYPE */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3">

            <Building2
              size={18}
              className="text-slate-500"
            />

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
              className="w-full outline-none bg-transparent"
            >

              <option value="">
                All Types
              </option>

              <option value="residential">
                Residential
              </option>

              <option value="commercial">
                Commercial
              </option>

              <option value="agriculture">
                Agriculture
              </option>

            </select>

          </div>

          {/* PRICE */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3">

            <IndianRupee
              size={18}
              className="text-slate-500"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
              className="w-full outline-none"
            />

          </div>

          {/* SORT */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3">

            <SlidersHorizontal
              size={18}
              className="text-slate-500"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="w-full outline-none bg-transparent"
            >

              <option value="">
                Sort by Price
              </option>

              <option value="low-high">
                Low to High
              </option>

              <option value="high-low">
                High to Low
              </option>

            </select>

          </div>

        </div>

      </section>

      {/* LISTINGS */}

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-bold">

              Available Properties

            </h2>

            <p className="text-slate-500">

              {properties.length} properties found

            </p>

          </div>

        </div>

        {loading ? (

          <div className="text-center py-20">

            Loading properties...

          </div>

        ) : properties.length === 0 ? (

          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

            <h3 className="text-2xl font-bold">

              No Properties Found

            </h3>

            <p className="text-slate-500 mt-3">

              Try changing your filters

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {properties.map(
              (
                property,
                index
              ) => (

                <PropertyCard
                  key={
                    property._id
                  }
                  data={property}
                  index={index}
                />
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}