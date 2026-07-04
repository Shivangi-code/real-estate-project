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

import {
  TypeAnimation,
} from "react-type-animation";

import PropertyCard from "../../components/PropertyCard";

import socket from "../../socket";

export default function Properties() {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [properties,
    setProperties] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState(
      searchParams.get(
        "search"
      ) || ""
    );

  const [type,
    setType] =
    useState(
      searchParams.get(
        "type"
      ) || ""
    );

  const [subType,
  setSubType] =
  useState(
    searchParams.get(
      "subType"
    ) || ""
  );

  const [maxPrice,
    setMaxPrice] =
    useState(
      searchParams.get(
        "maxPrice"
      ) || ""
    );
// ================= SUB TYPES =================

const subTypeOptions = {

  Residential: [
    "House",
    "Plot",
    "Villa",
    "Flat",
  ],

  Commercial: [
    "Office",
    "Shop",
    "Showroom",
    "Commercial Land",
  ],

  Agriculture: [
    "Farm Land",
    "Agriculture Land",
  ],
};

  const [sort,
    setSort] =
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

    if (subType)
      params.subType = subType;

    if (maxPrice)
      params.maxPrice =
        maxPrice;

    if (sort)
      params.sort = sort;

    setSearchParams(params, { replace: true });

  }, [
    search,
    type,
    subType,
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

        if (subType) {

          params.append(
            "subType",
            subType
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
            `${import.meta.env.VITE_API_URL}/api/properties/approved?${params.toString()}`
          );

        const data =
          await res.json();

        // ================= IMPORTANT FIX =================

        let updated = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
          ? data.properties
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

  // ================= FETCH EFFECT =================

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
    subType,
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
    subType,
    maxPrice,
    sort,
  ]);

  // ================= CLEAR FILTERS =================

  const clearFilters =
    () => {

      setSearch("");
      setType("");
      setSubType("");
      setMaxPrice("");
      setSort("");
    };

  return (

    <div className="bg-slate-50 min-h-screen">

      {/* HERO ANIMATION */}

      <style>
        {`
          @keyframes heroZoom {

            from {
              background-size: 100%;
            }

            to {
              background-size: 110%;
            }
          }

          @keyframes fadeUp {

            from {
              opacity: 0;
              transform: translateY(30px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* HERO SECTION */}

      <section
        className="
          text-white

          px-4
          sm:px-6
          md:px-10

          py-16
          sm:py-20
          md:py-24

          relative
          overflow-hidden
        "
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
            "heroZoom 12s ease-in-out infinite alternate",
        }}
      >

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

        {/* LIGHT EFFECTS */}

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">

          <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-blue-500/20 blur-3xl rounded-full" />

          <div className="absolute bottom-[-100px] right-[-100px] w-[280px] h-[280px] bg-cyan-400/20 blur-3xl rounded-full" />

        </div>

        {/* CONTENT */}

        <div className="max-w-7xl mx-auto relative z-10">

          <div
            className="max-w-4xl"
            style={{
              animation:
                "fadeUp 1s ease",
            }}
          >

            <p className="uppercase tracking-[6px] text-blue-200 text-sm font-semibold mb-5">

              VERIFIED MARKETPLACE

            </p>

            <h1 className="
                  text-3xl
                  sm:text-5xl
                  md:text-7xl

                  font-black

                  leading-tight
                ">

              <span className="text-white">

                Find Your Perfect

              </span>

              <br />

              <span className="bg-gradient-to-r from-blue-200 via-white to-cyan-300 bg-clip-text text-transparent">

                Property

              </span>

            </h1>

            <div className="mt-7 inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-xl px-5 py-3 rounded-full">

              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

              <span className="text-sm text-slate-200">

                Trusted by 1,000+ users across India

              </span>

            </div>

            <div className="
                  mt-6
                  sm:mt-8

                  text-base
                  sm:text-xl
                  md:text-2xl

                  text-slate-200

                  leading-8
                  sm:leading-10

                  font-light

                  max-w-3xl
                ">

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

      <section className="
                max-w-7xl
                mx-auto

                px-4
                sm:px-6
                md:px-10

                -mt-8
                sm:-mt-10
                md:-mt-12

                relative
                z-20
              ">

        <div className="
          bg-white

          rounded-[24px]
          sm:rounded-3xl

          shadow-xl

          p-4
          sm:p-5

          grid

          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-2
          xl:grid-cols-5

          gap-3
          sm:gap-4
        ">

          {/* SEARCH */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3.5 sm:py-4">

            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              type="text"
              placeholder="Search city or property"
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                // RESET SUBTYPE
                setSubType("");
              }}
              className="w-full outline-none"
            />

          </div>

          {/* TYPE */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3.5 sm:py-4">

            <Building2
              size={18}
              className="text-slate-500"
            />

            <select
              value={type}
              onChange={(e) => {

                setType(
                  e.target.value
                );

                // RESET SUBTYPE
                setSubType("");
              }}
              className="w-full outline-none bg-transparent"
            >

              <option value="">
                All Types
              </option>

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>

              <option value="Agriculture">
                Agriculture
              </option>

            </select>

          </div>
          
          {/* SUB TYPE */}

          <div className="
            flex items-center gap-3
            border rounded-2xl
            px-4 py-3.5 sm:py-4
          ">

            <Home
              size={18}
              className="text-slate-500"
            />

            <select
              value={subType}
              onChange={(e) =>
                setSubType(
                  e.target.value
                )
              }
              className="
                w-full
                outline-none
                bg-transparent
                text-sm
                sm:text-base
              "
            >

              <option value="">
                All Sub Types
              </option>

              {type &&
                subTypeOptions[type]?.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                    )
                )}

            </select>

          </div>

          {/* PRICE */}

          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3.5 sm:py-4">

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

      <section className="
        max-w-7xl
        mx-auto

        px-4
        sm:px-6
        md:px-10

        py-8
        sm:py-12
      ">

        <div className="
          flex

          flex-col
          sm:flex-row

          justify-between

          items-start
          sm:items-center

          gap-4

          mb-6
          sm:mb-8
        ">

          <div>

            <h2
              className="
                text-xl
                sm:text-2xl

                font-bold
              "
            >

              Available Properties

            </h2>

            <p className="text-slate-500">

              {properties.length}
              {" "}
              properties found
              <button
                onClick={clearFilters}
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-2

                  bg-slate-900
                  hover:bg-slate-700

                  text-white

                  px-4
                  py-2

                  rounded-xl

                  text-sm
                  font-medium

                  transition-all
                "
              >

                <X size={16} />

                Clear Filters

              </button>
            </p>

          </div>

        </div>

        {loading ? (

          <div className="text-center py-20">

            Loading properties...

          </div>

        ) : properties.length === 0 ? (

          <div className="
  bg-white

  rounded-[24px]
  sm:rounded-3xl

  p-6
  sm:p-12

  text-center

  shadow-sm
">

            <h3 className="text-2xl font-bold">

              No Properties Found

            </h3>

            <p className="text-slate-500 mt-3">

              Try changing your filters

            </p>

          </div>

        ) : (

          <div className="
              grid

              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3

              gap-4
              sm:gap-6
            ">

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

