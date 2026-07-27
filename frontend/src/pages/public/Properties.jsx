import {
  useEffect,
  useState,
  useRef,
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

import { ArrowUpDown } from "lucide-react";

import FloatingFilterActions from "../../components/FloatingFilterActions";

import MobileActionBar from "../../components/MobileActionBar";

import DesktopFilterBar from "../../components/DesktopFilterBar";

import MobileFilterDrawer from "../../components/MobileFilterDrawer";

import { px } from "framer-motion";

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

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  useEffect(() => {
    if (mobileFiltersOpen || mobileSortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen, mobileSortOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileFiltersOpen(false);
        closeSortSheet();
      }
    };

    if (mobileFiltersOpen || mobileSortOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileFiltersOpen, mobileSortOpen]);

  const [dragY, setDragY] = useState(0);

  const [startY, setStartY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {

    if (!isClosing) return;

    const timer = setTimeout(() => {

      setMobileSortOpen(false);

      setIsClosing(false);

      setDragY(0);

    }, 300);

    return () => clearTimeout(timer);

  }, [isClosing]);

  const closeSortSheet = () => {

    setIsClosing(true);

  };

  const openSortSheet = () => {

    setIsClosing(false);

    setDragY(0);

    setMobileSortOpen(true);

  };

  const [isFilterSticky, setIsFilterSticky] = useState(false);

  const [lastScrollY, setLastScrollY] = useState(0);

  const [showStickyBar, setShowStickyBar] = useState(true);

  const [floatingMode, setFloatingMode] = useState("full");

  const [filterStage, setFilterStage] = useState("normal");

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const stickyStartYRef = useRef(null);

  const filterBarRef = useRef(null);

  const filterSentinelRef = useRef(null);

  const filterStageRef = useRef("normal");

  const searchOpenScrollYRef = useRef(null);

  const ignoreProgrammaticScrollRef = useRef(false);

  const scrollStopTimerRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!filterBarRef.current) return;

      const rect = filterBarRef.current.getBoundingClientRect();

      const navbarHeight = 72;

      const shouldStick = rect.top <= navbarHeight;

      console.log({
        rectTop: rect.top,
        navbarHeight,
        shouldStick,
      });

      setIsFilterSticky(shouldStick);

      const currentScroll = window.scrollY;
      if (ignoreProgrammaticScrollRef.current) {
        clearTimeout(scrollStopTimerRef.current);

        scrollStopTimerRef.current = setTimeout(() => {
          ignoreProgrammaticScrollRef.current = false;
        }, 120);
        return;
      }
      if (
        isSearchExpanded &&
        searchOpenScrollYRef.current !== null &&
        Math.abs(currentScroll - searchOpenScrollYRef.current) > 20
      ) {
        setIsSearchExpanded(false);
        searchOpenScrollYRef.current = null;
      }

      const isDesktopOrTablet = window.innerWidth >= 768;

      const sentinelRect =
        filterSentinelRef.current?.getBoundingClientRect();

      if (!shouldStick) {

        filterStageRef.current = "normal";
        setFilterStage("normal");

        setIsSearchExpanded(false);

        stickyStartYRef.current = null;

      }
      else {

        if (stickyStartYRef.current === null) {

          stickyStartYRef.current = currentScroll;

        }

        const stickyDistance =
          currentScroll - stickyStartYRef.current;

        let nextStage = filterStageRef.current;

        if (isDesktopOrTablet) {

          // Tablets & Desktop:
          // Never morph into Pill/Bubble.
          // Stay permanently in Sticky mode.
          nextStage = "sticky";

        } else {

          // Mobile:
          // Sticky → Pill → Sticky
          if (filterStageRef.current === "sticky") {

            if (stickyDistance >= 160) {
              nextStage = "pill";
            }

          } else if (filterStageRef.current === "pill") {

            if (stickyDistance <= 120) {
              nextStage = "sticky";
            }

          } else {

            nextStage = "sticky";

          }

        }

        if (nextStage !== filterStageRef.current) {
          filterStageRef.current = nextStage;
          setFilterStage(nextStage);
        }

        setFilterStage(nextStage);

        console.log({
          nextStage,
          stickyDistance,
        });
        console.log({
          stage: filterStage,
          stickyStartY: stickyStartYRef.current,
          stickyDistance,
        });
      }

      setLastScrollY(currentScroll);
      console.log("isSearchExpanded:", isSearchExpanded);

    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchExpanded]);

  // ================= CLEAR FILTERS =================

  const clearFilters =
    () => {

      setSearch("");
      setType("");
      setSubType("");
      setMaxPrice("");
      setSort("");

      setIsSearchExpanded(false);
    };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;

    const distance = currentY - startY;

    // Prevent upward drag
    if (distance < 0) return;

    setDragY(distance);
  };

  const handleTouchEnd = () => {

    setIsDragging(false);

    if (dragY > 120) {

      closeSortSheet();

      return;

    }

    setDragY(0);

  };

  // ================= ACTIVE FILTER COUNT =================

  const activeFilterCount = [
    search,
    type,
    subType,
    maxPrice,
    sort,
  ].filter(Boolean).length;

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

          py-20
          sm:py-24
          md:py-28

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

                  leading-[1.1]
                  tracking-[-1px]
                ">

              <span className="text-white">

                Find Your Perfect

              </span>

              <br />

              <span className="bg-gradient-to-r from-blue-200 via-white to-cyan-300 bg-clip-text text-transparent">

                Property

              </span>

            </h1>

            <div className="mt-7 inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 backdrop-blur-xl px-5 py-3 rounded-full  shadow-lg shadow-black/20">

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

                  leading-7
                  sm:leading-9
                  md:leading-10

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

      <div
        ref={filterSentinelRef}
        className="h-px"
      />

      {/* FILTER BAR */}

      <section
        ref={filterBarRef}
        className={`
            max-w-7xl
            mx-auto

            px-4
            sm:px-6
            md:px-10

            transition-all
            duration-300
            ease-out

            ${isFilterSticky
            ? `
                        sticky
                        top-0.5
                        z-50
                        pt-0.5
                    `
            : `
                        -mt-8
                        sm:-mt-10
                        md:-mt-12

                        relative
                        z-20
                    `
          }
        `}
      >
        {(filterStage !== "pill" || isSearchExpanded) && (
          <div
            className={`
            backdrop-blur-xl

            border
            border-slate-200

            transition-all
            duration-300

            ${isFilterSticky
                ? `
                    bg-white/90
                    backdrop-blur-2xl
                    shadow-[0_12px_40px_rgba(15,23,42,0.18)]
                    rounded-2xl
                    p-3
                    scale-[0.99]
                  `
                : `
                    bg-white/95
                    rounded-[24px]
                    sm:rounded-3xl

                    shadow-[0_20px_50px_rgba(15,23,42,0.12)]

                    p-4
                    sm:p-5
                  `
              }

            grid

            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-6

            gap-4
          `}
          >

            {/* SEARCH */}

            <div
              className={`
              flex
              items-center
              gap-3

              min-h-[58px]

              border
              ${isFilterSticky
                  ? "border-slate-300"
                  : "border-slate-200"
                }

              rounded-2xl

              px-4

              transition-all
              duration-300

              hover:border-[#D4AF37]

              focus-within:border-[#D4AF37]
              focus-within:ring-2
              focus-within:ring-[#D4AF37]/20

              col-span-full
              lg:col-span-1
            `}>

              <Search
                size={18}
                className={`
                transition-all
                duration-300

                ${isFilterSticky
                    ? "text-[#071133]"
                    : "text-slate-400"
                  }
              `}
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
                className="
                  w-full
                  bg-transparent
                  outline-none

                  text-[15px]

                  placeholder:text-slate-400
                "
              />

            </div>

            <MobileActionBar
              activeFilterCount={activeFilterCount}
              onFilterClick={() => setMobileFiltersOpen(true)}
              onSortClick={openSortSheet}
              onClearClick={clearFilters}
            />

            <div
              className="
                hidden
                lg:contents
              "
            >
              <DesktopFilterBar
                type={type}
                setType={setType}
                subType={subType}
                setSubType={setSubType}
                subTypeOptions={subTypeOptions}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sort={sort}
                setSort={setSort}
                onClearClick={clearFilters}
              />

            </div>

          </div>
        )}

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

      <FloatingFilterActions
        stage={filterStage}
        isSearchExpanded={isSearchExpanded}
        activeFilterCount={activeFilterCount}

        onSearchClick={() => {
          if (!isSearchExpanded) {
            ignoreProgrammaticScrollRef.current = true;
          }
          filterBarRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          if (!isSearchExpanded) {
            searchOpenScrollYRef.current = window.scrollY;
          }
          setIsSearchExpanded((prev) => !prev);
        }}

        onFilterClick={() => {
          setMobileFiltersOpen(true);
        }}

        onSortClick={openSortSheet}

        onClearClick={clearFilters}
      />
      {console.log("Rendering FloatingFilterActions:", filterStage)}

      {/* ================= MOBILE FILTER DRAWER ================= */}

      <div
        onClick={() => setMobileFiltersOpen(false)}
        className={`
          fixed
          inset-0

          bg-black/50

          z-[1200]

          lg:hidden

          transition-opacity
          duration-300

          ${mobileFiltersOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }
        `}
      >

        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-title"
          className={`
            absolute

            top-0
            right-0

            h-full

            w-[88%]
            max-w-[420px]

            bg-gradient-to-b
            from-white
            to-slate-50

            shadow-[0_25px_60px_rgba(7,17,51,0.25)]

            flex
            flex-col

            transform
            transition-transform
            duration-300
            ease-out

            ${mobileFiltersOpen
              ? "translate-x-0"
              : "translate-x-full"
            }
          `}
        >

          {/* DRAWER HEADER */}

          <div
            className="
                bg-gradient-to-r
                from-[#071133]
                via-[#0B1D57]
                to-[#071133]

                text-white

                px-6
                py-5

                flex
                items-center
                justify-between

                border-b
                border-white/10

                shadow-lg

                shrink-0
              "
          >

            <h2
              id="mobile-filter-title"
              className="
                text-xl
                font-bold
                tracking-wide
              "
            >
              Filters
            </h2>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  text-white

                  transition-all
                  duration-300
                  ease-out

                  hover:bg-[#D4AF37]/15
                  hover:text-[#D4AF37]
                  hover:scale-110
                "
            >

              <X
                size={20}
                className="transition-colors duration-300"
              />

            </button>

          </div>

          {/* BODY */}

          <div
            className="
                flex-1
                overflow-y-auto
                p-6
              "
          >

            <div className="space-y-3 mb-6">

              <label
                className="
                    block
                    text-sm
                    font-semibold
                    tracking-wide
                    text-[#071133]
                  "
              >
                Property Type
              </label>

              <div
                className="
                    group

                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    px-4

                    rounded-2xl

                    border
                    border-slate-200

                    bg-white/80
                    backdrop-blur-md

                    shadow-sm

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]
                    hover:shadow-lg
                    hover:-translate-y-[2px]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                  "
              >

                <Building2
                  size={18}
                  className="
                      text-slate-400
                      transition-colors
                      duration-300
                      group-hover:text-[#D4AF37]
                    "
                />

                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setSubType("");
                  }}
                  className="
                      w-full
                      bg-transparent
                      outline-none
                      cursor-pointer
                      text-[15px]
                    "
                >

                  <option value="">All Types</option>

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

            </div>

            <div className="space-y-3 mb-6">

              <label
                className="
                    block
                    text-sm
                    font-semibold
                    tracking-wide
                    text-[#071133]
                  "
              >
                Property Sub Type
              </label>

              <div
                className="
                    group

                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    px-4

                    rounded-2xl

                    border
                    border-slate-200

                    bg-white/80
                    backdrop-blur-md

                    shadow-sm

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]
                    hover:shadow-lg
                    hover:-translate-y-[2px]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                  "
              >

                <Home
                  size={18}
                  className="
                      text-slate-400
                      transition-colors
                      duration-300
                      group-hover:text-[#D4AF37]
                    "
                />

                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="
                      w-full
                      bg-transparent
                      outline-none
                      cursor-pointer
                      text-[15px]
                    "
                >

                  <option value="">
                    All Sub Types
                  </option>

                  {type &&
                    subTypeOptions[type]?.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}

                </select>

              </div>

            </div>

            <div className="space-y-3 mb-6">

              <label
                className="
                    block
                    text-sm
                    font-semibold
                    tracking-wide
                    text-[#071133]
                  "
              >
                Maximum Price
              </label>

              <div
                className="
                    group

                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    border
                    border-slate-200

                    rounded-2xl

                    px-4

                    bg-white/80
                    backdrop-blur-md

                    shadow-sm

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]
                    hover:shadow-lg
                    hover:-translate-y-[2px]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                  "
              >

                <IndianRupee
                  size={18}
                  className="
                      text-slate-400
                      transition-colors
                      duration-300
                      group-hover:text-[#D4AF37]
                    "
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="
                      w-full
                      bg-transparent
                      outline-none

                      text-[15px]

                      placeholder:text-slate-400
                    "
                />

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div
            className="
                shrink-0

                border-t
                border-slate-200

                bg-white/90
                backdrop-blur-xl

                p-5

                flex
                gap-3
              "
          >

            {/* CLEAR */}

            <button
              onClick={clearFilters}
              className="
                  flex-1

                  h-12

                  rounded-xl

                  border
                  border-[#D4AF37]

                  text-[#D4AF37]

                  font-semibold

                  transition-all
                  duration-300

                  hover:bg-[#D4AF37]
                  hover:text-white
                "
            >
              Clear
            </button>

            {/* APPLY */}

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="
                  flex-1

                  h-12

                  rounded-xl

                  bg-gradient-to-r
                  from-[#071133]
                  to-[#0B1D57]

                  text-white

                  font-semibold

                  shadow-lg

                  transition-all
                  duration-300

                  hover:scale-[1.02]
                  hover:shadow-xl
                "
            >
              Apply Filters
            </button>

          </div>

        </div>

      </div>

      {/* ================= MOBILE SORT SHEET ================= */}

      <div
        onClick={closeSortSheet}
        className={`
          fixed
          inset-0

          bg-black/50

          z-[1250]

          lg:hidden

          transition-opacity
          duration-300

          ${mobileSortOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }
        `}
      >

        <div
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`
            absolute

            bottom-0
            left-0
            right-0
            max-h-[80vh]

            rounded-t-3xl

            bg-white

            shadow-[0_-20px_60px_rgba(7,17,51,0.25)]

            transition-transform
            duration-300
            ease-out

            ${mobileSortOpen
              ? "translate-y-0"
              : "translate-y-full"
            }
          `}

          style={{
            transform: isClosing
              ? "translateY(100%)"
              : mobileSortOpen
                ? `translateY(${dragY}px)`
                : "translateY(100%)",

            transition: isDragging
              ? "none"
              : "transform 300ms ease",
          }}
        >
          {/* Handle */}

          <div className="flex justify-center pt-3">

            <div
              className="
                w-14
                h-1.5

                rounded-full

                bg-slate-300
              "
            />

          </div>

          {/* Header */}

          <div
            className="
              px-6
              pt-5
              pb-3

              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-[#071133]
                "
              >
                Sort Properties
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                Choose how you'd like the listings to be ordered.
              </p>

            </div>

            <button
              onClick={closeSortSheet}
              aria-label="Close sort sheet"
              className="
                w-10
                h-10

                flex
                items-center
                justify-center

                rounded-xl

                text-slate-500

                transition-all
                duration-300

                hover:bg-slate-100
                hover:text-[#071133]

                active:scale-95
              "
            >

              <X size={20} />

            </button>

          </div>

          <div className="border-b border-slate-200" />

          <div className="py-2">

            {/* Default */}

            <button
              onClick={() => {
                setSort("");
                closeSortSheet();
              }}
              className={`
                w-full

                flex
                items-center
                justify-between

                px-6
                py-4

                rounded-xl

                transition-all
                duration-200

                active:scale-[0.98]

                ${sort === ""
                  ? "bg-[#D4AF37]/10 text-[#071133]"
                  : "hover:bg-slate-50"
                }
              `}
            >

              <span className="font-medium">
                Default
              </span>

              {sort === "" && (
                <div
                  className="
                    w-7
                    h-7

                    rounded-full

                    bg-[#D4AF37]

                    text-white

                    flex
                    items-center
                    justify-center

                    text-sm
                    font-bold
                  "
                >
                  ✓
                </div>
              )}

            </button>

            {/* Low → High */}

            <button
              onClick={() => {
                setSort("low-high");
                closeSortSheet();
              }}
              className={`
                w-full

                flex
                items-center
                justify-between

                px-6
                py-4

                rounded-xl

                transition-all
                duration-200

                active:scale-[0.98]
                ${sort === "low-high"
                  ? "bg-[#D4AF37]/10 text-[#071133]"
                  : "hover:bg-slate-50"
                }
              `}
            >

              <span className="font-medium">
                Price: Low → High
              </span>

              {sort === "low-high" && (
                <div
                  className="
                    w-7
                    h-7

                    rounded-full

                    bg-[#D4AF37]

                    text-white

                    flex
                    items-center
                    justify-center

                    text-sm
                    font-bold
                  "
                >
                  ✓
                </div>
              )}

            </button>

            {/* High → Low */}

            <button
              onClick={() => {
                setSort("high-low");
                closeSortSheet();
              }}
              className={`
                w-full

                flex
                items-center
                justify-between

                px-6
                py-4

                rounded-xl

                transition-all
                duration-200

                active:scale-[0.98]

                ${sort === "high-low"
                  ? "bg-[#D4AF37]/10 text-[#071133]"
                  : "hover:bg-slate-50"
                }
              `}
            >

              <span className="font-medium">
                Price: High → Low
              </span>

              {sort === "high-low" && (
                <div
                  className="
                    w-7
                    h-7

                    rounded-full

                    bg-[#D4AF37]

                    text-white

                    flex
                    items-center
                    justify-center

                    text-sm
                    font-bold
                  "
                >
                  ✓
                </div>
              )}

            </button>

          </div>

        </div>

      </div>



    </div>
  );
}

