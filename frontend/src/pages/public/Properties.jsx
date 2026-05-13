import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  Search,
  SlidersHorizontal,
  Home,
  Building2,
  Trees,
  IndianRupee,
  X,
} from "lucide-react";

import PropertyCard from "../../components/PropertyCard";

import socket from "../../socket";

export default function Properties() {

  // ================= URL PARAMS =================
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  // ================= STATES =================
  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FILTER STATES =================
  const [search, setSearch] =
    useState(
      searchParams.get(
        "search"
      ) || ""
    );

  const [type, setType] =
    useState(
      searchParams.get(
        "type"
      ) || ""
    );

  const [maxPrice, setMaxPrice] =
    useState(
      searchParams.get(
        "maxPrice"
      ) || ""
    );

  const [sort, setSort] =
    useState(
      searchParams.get(
        "sort"
      ) || ""
    );

  // ================= UPDATE URL =================
  useEffect(() => {

    const params = {};

    if (search)
      params.search = search;

    if (type)
      params.type = type;

    if (maxPrice)
      params.maxPrice =
        maxPrice;

    if (sort)
      params.sort = sort;

    setSearchParams(params);

  }, [
    search,
    type,
    maxPrice,
    sort,
  ]);

  // ================= FETCH =================
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

        const res = await fetch(
          `http://localhost:5000/api/properties/approved?${params.toString()}`
        );

        const data =
          await res.json();

        let updated =
          Array.isArray(data)
            ? data
            : [];

        // ================= SORT =================
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

        setProperties(updated);

      } catch {

        setProperties([]);

      } finally {

        setLoading(false);
      }
    };

  // ================= DEBOUNCE SEARCH =================
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

  // ================= REALTIME =================
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

  }, [
    search,
    type,
    maxPrice,
    sort,
  ]);

  // ================= CLEAR FILTERS =================
  const clearFilters = () => {

    setSearch("");
    setType("");
    setMaxPrice("");
    setSort("");
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 md:px-10 py-16">

        <div className="max-w-7xl mx-auto">

          <p className="uppercase text-sm tracking-widest text-slate-300">
            Verified Marketplace
          </p>

          <h1 className="text-5xl font-bold mt-3 leading-tight">
            Find Your Perfect
            {" "}
            Property
          </h1>

          <p className="text-slate-300 mt-4 max-w-2xl">
  Browse verified residential,
  commercial and agricultural
  properties across India.
</p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 -mt-10 relative z-10">

        <div className="bg-white rounded-3xl shadow-xl p-6 grid lg:grid-cols-4 gap-4">

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

        {/* ACTIVE FILTERS */}
        {(search ||
          type ||
          maxPrice ||
          sort) && (

          <div className="flex flex-wrap gap-3 mt-5">

            {search && (
              <div className="bg-white shadow-sm rounded-full px-4 py-2 text-sm flex items-center gap-2">
                Search:
                {" "}
                <b>{search}</b>

                <button
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {type && (
              <div className="bg-white shadow-sm rounded-full px-4 py-2 text-sm flex items-center gap-2 capitalize">
                {type}

                <button
                  onClick={() =>
                    setType("")
                  }
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {maxPrice && (
              <div className="bg-white shadow-sm rounded-full px-4 py-2 text-sm flex items-center gap-2">
                Max ₹
                {maxPrice}

                <button
                  onClick={() =>
                    setMaxPrice(
                      ""
                    )
                  }
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {sort && (
              <div className="bg-white shadow-sm rounded-full px-4 py-2 text-sm flex items-center gap-2">
                {sort}

                <button
                  onClick={() =>
                    setSort("")
                  }
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* CLEAR */}
            <button
              onClick={
                clearFilters
              }
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium transition"
            >
              Clear Filters
            </button>

          </div>
        )}
      </section>

      {/* CATEGORY PILLS */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mt-8">

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() =>
              setType("")
            }
            className={`px-5 py-3 rounded-2xl font-medium transition ${
              type === ""
                ? "bg-slate-900 text-white"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            <Home size={16} className="inline mr-2" />
            All
          </button>

          <button
            onClick={() =>
              setType(
                "residential"
              )
            }
            className={`px-5 py-3 rounded-2xl font-medium transition ${
              type ===
              "residential"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            <Home size={16} className="inline mr-2" />
            Residential
          </button>

          <button
            onClick={() =>
              setType(
                "commercial"
              )
            }
            className={`px-5 py-3 rounded-2xl font-medium transition ${
              type ===
              "commercial"
                ? "bg-green-600 text-white"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            <Building2 size={16} className="inline mr-2" />
            Commercial
          </button>

          <button
            onClick={() =>
              setType(
                "agriculture"
              )
            }
            className={`px-5 py-3 rounded-2xl font-medium transition ${
              type ===
              "agriculture"
                ? "bg-yellow-500 text-white"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            <Trees size={16} className="inline mr-2" />
            Agriculture
          </button>

        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">

        {/* STATS */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-2xl font-bold">
              Available Properties
            </h2>

            <p className="text-slate-500">
              {properties.length}
              {" "}
              properties found
            </p>

          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-sm font-semibold flex items-center gap-2">

            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />

            Live Sync Active

          </div>
        </div>

        {/* CONTENT */}
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