import {

  useEffect,

  useMemo,

  useState,

} from "react";

import {

  useNavigate,

} from "react-router-dom";

import {

  motion,

  AnimatePresence,

} from "framer-motion";

import toast from "react-hot-toast";

// ======================================================
// ================= SOCKET =============================
// ======================================================

import socket from "../../socket";

// ======================================================
// ================= ICONS ==============================
// ======================================================

import {

  PlusCircle,

  Building2,

  Hammer,

  CheckCircle2,

  XCircle,

  Trash2,

  Clock3,

  MapPin,

  IndianRupee,

  TrendingUp,

  ArrowUpRight,

  Eye,

  ShieldAlert,

  Lock,

  CalendarDays,

  Building,

  Search,

  Layers3,

  Image as ImageIcon,

  BadgeInfo,

  RefreshCcw,

  Radio,

  Activity,

} from "lucide-react";

// ======================================================
// ================= API BASE ===========================
// ======================================================

  const API_BASE = import.meta.env.VITE_API_URL;

// ======================================================
// ================= FALLBACK IMAGE =====================
// ======================================================

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x700?text=Builder+Property";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function BuilderDashboard() {

  const navigate =
    useNavigate();

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [

    properties,

    setProperties,

  ] = useState([]);

  const [

    loading,

    setLoading,

  ] = useState(true);

  const [

    search,

    setSearch,

  ] = useState("");

  const [

    activeTab,

    setActiveTab,

  ] = useState("all");

  const [

    liveActivity,

    setLiveActivity,

  ] = useState(null);

  const [

    isRefreshing,

    setIsRefreshing,

  ] = useState(false);

  // ======================================================
  // ================= SAFE USER ==========================
  // ======================================================

  const user =
    useMemo(() => {

      try {

        return JSON.parse(

          localStorage.getItem(
            "user"
          ) || "{}"
        );

      } catch {

        return {};
      }

    }, []);

  // ======================================================
  // ================= TOKEN ==============================
  // ======================================================

  const token =
    useMemo(() =>

      localStorage.getItem(
        "token"
      ),

      []
    );

  // ======================================================
  // ================= FETCH PROPERTIES ===================
  // ======================================================

  const fetchProperties =
    async (
      showLoader = false
    ) => {

      try {

        if (
          showLoader
        ) {

          setIsRefreshing(
            true
          );
        }

        const res =
          await fetch(

            `${API_BASE}/api/properties/my-properties`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        if (
          data?.properties
        ) {

          setProperties(
            data.properties
          );

        } else if (
          Array.isArray(
            data
          )
        ) {

          setProperties(
            data
          );

        } else {

          setProperties(
            []
          );
        }

      } catch (
        error
      ) {

        console.log(
          error
        );

        toast.error(

          "Failed to fetch builder properties"
        );

        setProperties(
          []
        );

      } finally {

        setLoading(
          false
        );

        setIsRefreshing(
          false
        );
      }
    };

  // ======================================================
  // ================= LOAD ===============================
  // ======================================================

  useEffect(() => {

    fetchProperties();

  }, []);

  // ======================================================
  // ================= LIVE SOCKET SYNC ==================
  // ======================================================

  useEffect(() => {

    // ======================================================
    // ================= PROPERTY UPDATE ===================
    // ======================================================

    const handlePropertyUpdated =
      async (
        payload
      ) => {

        // ======================================================
        // ================= OWNER FILTER =======================
        // ======================================================

        if (

          payload?.ownerId !==
          user?._id
        ) {

          return;
        }

        // ======================================================
        // ================= LIVE ACTIVITY ======================
        // ======================================================

        setLiveActivity({

          title:
            payload?.title ||

            "Builder Property Updated",

          status:
            payload?.status ||

            "updated",

          time:
            Date.now(),
        });

        // ======================================================
        // ================= REFRESH ============================
        // ======================================================

        await fetchProperties(
          true
        );

        // ======================================================
        // ================= AUTO CLEAR =========================
        // ======================================================

        setTimeout(() => {

          setLiveActivity(
            null
          );

        }, 5000);
      };

    // ======================================================
    // ================= MODERATION EVENT ===================
    // ======================================================

    const handleModerationNotification =
      (
        notification
      ) => {

        if (
          notification?.message
        ) {

          toast.success(

            notification.message
          );
        }
      };

    // ======================================================
    // ================= SOCKET EVENTS ======================
    // ======================================================

    socket.on(

      "propertyUpdated",

      handlePropertyUpdated
    );

    socket.on(

      "moderationNotification",

      handleModerationNotification
    );

    // ======================================================
    // ================= CLEANUP ============================
    // ======================================================

    return () => {

      socket.off(

        "propertyUpdated",

        handlePropertyUpdated
      );

      socket.off(

        "moderationNotification",

        handleModerationNotification
      );
    };

  }, [user?._id]);

  // ======================================================
  // ================= COUNTS =============================
  // ======================================================

  const counts = {

    total:
      properties.length,

    pending:
      properties.filter(
        (p) =>
          p.status ===
          "pending"
      ).length,

    approved:
      properties.filter(
        (p) =>
          p.status ===
          "approved"
      ).length,

    rejected:
      properties.filter(
        (p) =>
          p.status ===
          "rejected"
      ).length,

    deleted:
      properties.filter(
        (p) =>
          p.status ===
          "deleted"
      ).length,
  };

  // ======================================================
  // ================= FORMAT PRICE =======================
  // ======================================================

  const formatPrice = (
    price
  ) => {

    if (!price)
      return "₹ 0";

    if (
      price >= 10000000
    ) {

      return `₹ ${(
        price / 10000000
      ).toFixed(1)} Cr`;
    }

    if (
      price >= 100000
    ) {

      return `₹ ${(
        price / 100000
      ).toFixed(1)} L`;
    }

    return `₹ ${price}`;
  };

  // ======================================================
  // ================= FORMAT DATE ========================
  // ======================================================

  const formatDate = (
    date
  ) => {

    if (!date)
      return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {

        day: "2-digit",

        month: "short",

        year: "numeric",
      }
    );
  };

  // ======================================================
  // ================= PRICE PER UNIT =====================
  // ======================================================

  const getPricePerUnit =
    (
      price,
      area
    ) => {

      if (
        !price ||
        !area
      ) {

        return 0;
      }

      return Math.round(
        price / area
      ).toLocaleString("en-IN");
    };

  // ======================================================
  // ================= STATUS BADGE =======================
  // ======================================================

  const getStatusBadge =
    (
      status
    ) => {

      switch (
        status
      ) {

        case "approved":

          return (

            <div
              className="
                bg-green-100
                text-green-700
                px-3
                py-1.5
                rounded-full
                text-xs
                font-bold
              "
            >

              ✅ Approved

            </div>
          );

        case "rejected":

          return (

            <div
              className="
                bg-red-100
                text-red-700
                px-3
                py-1.5
                rounded-full
                text-xs
                font-bold
              "
            >

              ❌ Rejected

            </div>
          );

        case "deleted":

          return (

            <div
              className="
                bg-black
                text-white
                px-3
                py-1.5
                rounded-full
                text-xs
                font-bold
              "
            >

              🗑 Archived

            </div>
          );

        default:

          return (

            <div
              className="
                bg-yellow-100
                text-yellow-700
                px-3
                py-1.5
                rounded-full
                text-xs
                font-bold
              "
            >

              ⏳ Pending

            </div>
          );
      }
    };

  // ======================================================
  // ================= FILTERED ===========================
  // ======================================================

  const filteredProperties =

    properties.filter(
      (property) => {

        const matchesSearch =

          property.title
            ?.toLowerCase()
            .includes(

              search.toLowerCase()
            ) ||

          property.location
            ?.toLowerCase()
            .includes(

              search.toLowerCase()
            );

        const matchesTab =

          activeTab ===
          "all"

            ? true

            : property.status ===
              activeTab;

        return (

          matchesSearch &&
          matchesTab
        );
      }
    );

  // ======================================================
  // ================= TAB BUTTON =========================
  // ======================================================

  const TabButton = ({
    label,
    value,
    count,
  }) => (

    <button

      onClick={() =>
        setActiveTab(
          value
        )
      }

      className={`

        px-5
        py-3

        rounded-2xl

        text-sm
        font-bold

        transition-all

        whitespace-nowrap

        ${
          activeTab ===
          value

            ? `

                bg-black
                text-white
              `

            : `

                bg-white
                text-slate-700

                border
                border-slate-200

                hover:border-black
              `
        }
      `}
    >

      {label}

      <span
        className="
          ml-2
          opacity-80
        "
      >

        ({count})

      </span>

    </button>
  );

  // ======================================================
  // ================= STAT CARD ==========================
  // ======================================================

  const StatCard = ({
    title,
    value,
    icon,
    glow,
  }) => (

    <motion.div

      whileHover={{

        y: -6,
        scale: 1.02,
      }}

      transition={{
        duration: 0.25,
      }}

      className="
        relative
        rounded-[30px]
        p-[1.5px]
        overflow-hidden
      "
    >

      <div
        className="
          absolute
          inset-0
          rounded-[30px]
          bg-[conic-gradient(from_0deg,#061a3a,#0b3aa4,#061a3a,#0b3aa4,#061a3a)]
          animate-[spin_4s_linear_infinite]
        "
      />

      <div
        className="
          relative
          overflow-hidden
          rounded-[30px]
          bg-white
          p-6
          shadow-[0_10px_40px_rgba(0,0,0,0.12)]
        "
      >

        <div
          className={`
            absolute
            -top-10
            -right-10
            w-32
            h-32
            rounded-full
            blur-3xl
            opacity-20
            ${glow}
          `}
        />

        <div
          className="
            relative
            z-10
            flex
            items-start
            justify-between
          "
        >

          <div>

            <p
              className="
                text-slate-600
                text-sm
                font-semibold
              "
            >

              {title}

            </p>

            <h2
              className="
                text-3xl
                sm:text-4xl
                font-extrabold
                mt-3
                text-slate-900
              "
            >

              {value || 0}

            </h2>

          </div>

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-slate-100
              border
              border-slate-200
              flex
              items-center
              justify-center
              text-slate-800
            "
          >

            {icon}

          </div>

        </div>

      </div>

    </motion.div>
  );

  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-white
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            text-center
          "
        >

          <RefreshCcw
            size={42}
            className="
              animate-spin
              text-orange-600
              mx-auto
            "
          />

          <p
            className="
              mt-5
              text-xl
              font-semibold
            "
          >

            Loading Builder Dashboard...

          </p>

        </div>

      </div>
    );
  }

  // ======================================================
  // ================= RETURN =============================
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-white
        overflow-hidden
        relative
        px-4
        sm:px-6
        md:px-10
        py-6
        sm:py-8
      "
    >

      {/* ====================================================== */}
      {/* ================= LIVE ACTIVITY ====================== */}
      {/* ====================================================== */}

      <AnimatePresence>

        {liveActivity && (

          <motion.div

            initial={{

              opacity: 0,

              y: -20,
            }}

            animate={{

              opacity: 1,

              y: 0,
            }}

            exit={{

              opacity: 0,

              y: -20,
            }}

            className="
              mb-6
              bg-gradient-to-r
              from-orange-500
              to-orange-700
              text-white
              rounded-3xl
              p-5
              shadow-2xl
              flex
              flex-col
              sm:flex-row
              items-start
              sm:items-center
              justify-between
              gap-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-white/20
                  flex
                  items-center
                  justify-center
                "
              >

                <Radio
                  size={24}
                />

              </div>

              <div>

                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >

                  Live Builder Update

                </h3>

                <p
                  className="
                    text-orange-100
                    text-sm
                    mt-1
                  "
                >

                  {liveActivity.title}

                </p>

              </div>

            </div>

            <div
              className="
                flex
                items-center
                gap-3
                text-sm
                font-semibold
              "
            >

              <Activity
                size={18}
              />

              LIVE

            </div>

          </motion.div>
        )}

      </AnimatePresence>

{/* ====================================================== */}
      {/* ================= HERO =============================== */}
      {/* ====================================================== */}

      <motion.div

        initial={{
          opacity: 0,
          y: 25,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="

          relative

          z-10

          rounded-[24px]
          sm:rounded-[38px]

          overflow-hidden

          p-[3px]

          mb-8
        "
      >

        {/* BORDER */}
        <div
          className="
            absolute
            inset-0

            rounded-[24px]
            sm:rounded-[38px]

            overflow-hidden
          "
        >

          <div
            className="
              absolute

              top-0
              left-[-40%]

              h-full
              w-[40%]

              bg-gradient-to-r

              from-transparent
              via-orange-500
              to-transparent

              opacity-90

              animate-[moveBorder_3s_linear_infinite]
            "
          />

        </div>

        {/* CONTENT */}
        <div
          className="

            relative

            rounded-[36px]

            p-5
            sm:p-8
            md:p-10

            bg-cover
            bg-center

            overflow-hidden
          "
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9")',
          }}
        >

          <div
            className="
              absolute
              inset-0
              bg-black/60
            "
          />

          <div
            className="

              relative
              z-10

              flex
              flex-col

              xl:flex-row
              justify-between
              items-center

              gap-10
            "
          >

            {/* LEFT */}
            <div
              className="
                max-w-3xl
              "
            >

              <h1
                className="
                  text-3xl
                  sm:text-5xl
                  md:text-6xl

                  font-extrabold

                  leading-tight

                  text-orange-100
                "
              >

                Welcome back,

              </h1>

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >

                <motion.div
                  className="
                    px-5
                    py-3

                    rounded-2xl

                    border
                    border-white/20

                    bg-white/10

                    backdrop-blur-xl
                  "
                >

                  <h2
                    className="
                      text-xl
                      sm:text-2xl
                      md:text-3xl

                      font-extrabold

                      uppercase

                      text-orange-100
                    "
                  >

                    {
                      user?.name ||
                      "BUILDER"
                    }

                  </h2>

                  <p
                    className="
                      text-orange-200

                      text-[10px]

                      tracking-[4px]

                      uppercase

                      mt-1

                      font-semibold
                    "
                  >

                    {
                      user?.role?.toUpperCase() ||

                      "BUILDER"
                    }

                  </p>

                </motion.div>

                <div
                  className="
                    hidden
                    md:flex

                    items-center
                    gap-2

                    text-orange-100

                    bg-white/10

                    border
                    border-white/20

                    px-3
                    py-2

                    rounded-xl

                    font-semibold
                  "
                >

                  <TrendingUp
                    size={14}
                  />

                  Moderation Enabled

                </div>

              </div>

              {/* MOBILE */}
              <p
                className="
                  mt-5

                  text-slate-200

                  text-sm

                  leading-6

                  max-w-[260px]

                  lg:hidden
                "
              >

                Manage premium
                builder properties and
                monitor verification
                lifecycle.

              </p>

              {/* DESKTOP */}
              <p
                className="
                  hidden
                  lg:block

                  mt-6

                  text-slate-200

                  text-lg

                  leading-8

                  max-w-2xl
                "
              >

                Manage premium
                builder projects,
                monitor moderation
                lifecycle, and grow
                your real estate
                business professionally.

              </p>

              {/* ACTIONS */}
              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                  mt-8
                "
              >

                <button

                  onClick={() =>
                    navigate(
                      "/add-property"
                    )
                  }

                  className="

                    bg-white

                    text-slate-900

                    px-5
                    sm:px-7

                    py-3.5
                    sm:py-4

                    rounded-2xl

                    font-semibold

                    hover:scale-105

                    transition-all
                    duration-300

                    shadow-xl

                    flex
                    items-center
                    gap-3
                  "
                >

                  <PlusCircle
                    size={20}
                  />

                  Add Property

                  <ArrowUpRight
                    size={18}
                  />

                </button>
                <button

                  onClick={() =>
                    navigate(
                      "/builder-properties"
                    )
                  }

                  className="

                    bg-orange-500/20

                    text-white

                    border
                    border-orange-300/30

                    px-5
                    sm:px-7

                    py-3.5
                    sm:py-4

                    rounded-2xl

                    font-semibold

                    hover:bg-orange-500/30

                    transition-all
                    duration-300

                    backdrop-blur-xl

                    flex
                    items-center
                    gap-3
                  "
                >

                  <Building2
                    size={20}
                  />

                  My Properties

                </button>
              </div>

            </div>

            {/* RIGHT */}
            <motion.div

              animate={{
                y: [0, -10, 0],
              }}

              transition={{
                repeat: Infinity,
                duration: 4,
              }}

              className="
                relative
              "
            >

              <div
                className="

                  relative

                  w-[170px]
                  h-[170px]

                  sm:w-[240px]
                  sm:h-[240px]

                  rounded-full

                  bg-white/10

                  backdrop-blur-2xl

                  flex
                  items-center
                  justify-center

                  border
                  border-white/30
                "
              >

                <motion.img

                  src="https://cdn-icons-png.flaticon.com/512/619/619034.png"

                  className="
                    w-24
                    h-24

                    sm:w-36
                    sm:h-36

                    object-contain

                    drop-shadow-xl
                  "

                  alt="building"

                  animate={{
                    y: [0, -6, 0],
                    scale: [1, 1.03, 1],
                  }}

                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

              </div>

            </motion.div>

          </div>

        </div>

      </motion.div>

      {/* ====================================================== */}
      {/* ================= STATS ============================== */}
      {/* ====================================================== */}

      <div
        className="

          grid

          grid-cols-2
          xl:grid-cols-5

          gap-4
          sm:gap-6

          mb-8
        "
      >

        <StatCard
          title="Total"
          value={counts.total}
          icon={
            <Building
              size={24}
            />
          }
          glow="bg-orange-500"
        />

        <StatCard
          title="Pending"
          value={counts.pending}
          icon={
            <Hammer
              size={24}
            />
          }
          glow="bg-yellow-500"
        />

        <StatCard
          title="Approved"
          value={counts.approved}
          icon={
            <CheckCircle2
              size={24}
            />
          }
          glow="bg-green-500"
        />

        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon={
            <XCircle
              size={24}
            />
          }
          glow="bg-red-500"
        />

        <StatCard
          title="Archived"
          value={counts.deleted}
          icon={
            <Trash2
              size={24}
            />
          }
          glow="bg-slate-700"
        />

      </div>

      {/* ====================================================== */}
      {/* ================= FILTER BAR ========================= */}
      {/* ====================================================== */}

      <div
        className="

          bg-white

          rounded-[28px]

          p-5
          sm:p-6

          shadow-lg

          border
          border-slate-200

          mb-8
        "
      >

        {/* SEARCH */}
        <div
          className="
            relative
            mb-5
          "
        >

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input

            type="text"

            placeholder="
              Search by title or location
            "

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="

              w-full

              bg-slate-100

              border
              border-slate-200

              rounded-2xl

              pl-12
              pr-4
              py-4

              outline-none

              focus:border-black
            "
          />

        </div>

        {/* TABS */}
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-1
          "
        >

          <TabButton
            label="All"
            value="all"
            count={counts.total}
          />

          <TabButton
            label="Pending"
            value="pending"
            count={counts.pending}
          />

          <TabButton
            label="Approved"
            value="approved"
            count={counts.approved}
          />

          <TabButton
            label="Rejected"
            value="rejected"
            count={counts.rejected}
          />

          <TabButton
            label="Archived"
            value="deleted"
            count={counts.deleted}
          />

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= EMPTY STATE ======================== */}
      {/* ====================================================== */}

      {filteredProperties.length ===
      0 ? (

        <div
          className="

            bg-white

            rounded-[28px]

            p-10
            sm:p-16

            text-center

            border
            border-slate-200

            shadow-sm
          "
        >

          <Building2
            size={60}
            className="
              mx-auto
              text-orange-500
            "
          />

          <h2
            className="
              text-3xl
              font-bold
              mt-5
              text-slate-900
            "
          >

            No Properties Found

          </h2>

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            No builder properties
            matched your current
            filters.

          </p>

          <button

            onClick={() =>
              navigate(
                "/add-property"
              )
            }

            className="
              mt-7

              bg-orange-600
              hover:bg-orange-700

              text-white

              px-6
              py-3

              rounded-2xl

              font-semibold

              transition
            "
          >

            Add Property

          </button>

        </div>

      ) : (

        <div
          className="

            grid

            grid-cols-1
            sm:grid-cols-2
            2xl:grid-cols-3

            gap-6
          "
        >

          {filteredProperties.map(
            (
              property
            ) => (

              <motion.div

                key={
                  property._id
                }

                whileHover={{
                  y: -6,
                }}

                className="

                  bg-white

                  rounded-[28px]

                  overflow-hidden

                  border
                  border-slate-200

                  shadow-sm
                "
              >

                {/* IMAGE */}
                <div
                  className="
                    relative
                  "
                >

                  <img

                    src={
                      property.image ||
                      FALLBACK_IMAGE
                    }

                    onError={(
                      e
                    ) => {

                      e.target.src =
                        FALLBACK_IMAGE;
                    }}

                    alt={
                      property.title
                    }

                    className="

                      w-full

                      h-[240px]

                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      top-4
                      left-4
                    "
                  >

                    {getStatusBadge(
                      property.status
                    )}

                  </div>

                </div>

                {/* BODY */}
                <div
                  className="
                    p-5
                  "
                >

                  {/* TITLE */}
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-2xl
                          font-bold
                          leading-tight
                          text-slate-900
                        "
                      >

                        {
                          property.title
                        }

                      </h2>

                      <div
                        className="
                          flex
                          items-center
                          gap-2

                          text-slate-500

                          mt-3
                        "
                      >

                        <MapPin
                          size={16}
                        />

                        <span>

                          {
                            property.location
                          }

                        </span>

                      </div>

                    </div>

                  </div>

                  {/* PRICE */}
                  <div
                    className="
                      mt-5
                    "
                  >

                    <h3
                      className="
                        text-3xl
                        font-extrabold
                        text-slate-900
                      "
                    >

                      {formatPrice(
                        property.price
                      )}

                    </h3>

                  </div>

                  {/* INFO GRID */}
                  <div
                    className="

                      grid

                      grid-cols-2

                      gap-4

                      mt-6
                    "
                  >

                    {/* AREA */}
                    <div
                      className="
                        bg-slate-50
                        rounded-2xl
                        p-4
                      "
                    >

                      <BadgeInfo
                        size={18}
                        className="
                          text-indigo-600
                        "
                      />

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-2
                        "
                      >

                        Area

                      </p>

                      <h4
                        className="
                          font-bold
                          mt-1
                        "
                      >

                        {
                          property.area
                        }{" "}

                        {
                          property.areaUnit
                        }

                      </h4>

                    </div>

                    {/* PRICE / UNIT */}
                    <div
                      className="
                        bg-slate-50
                        rounded-2xl
                        p-4
                      "
                    >

                      <IndianRupee
                        size={18}
                        className="
                          text-green-600
                        "
                      />

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-2
                        "
                      >

                        Price/sqft

                      </p>

                      <h4
                        className="
                          font-bold
                          mt-1
                        "
                      >

                        ₹

                        {getPricePerUnit(

                          property.price,

                          property.area
                        )}

                      </h4>

                    </div>

                    {/* CATEGORY */}
                    <div
                      className="
                        bg-slate-50
                        rounded-2xl
                        p-4
                      "
                    >

                      <Layers3
                        size={18}
                        className="
                          text-violet-600
                        "
                      />

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-2
                        "
                      >

                        Category

                      </p>

                      <h4
                        className="
                          font-bold
                          mt-1
                          capitalize
                        "
                      >

                        {
                          property.subType ||
                          "N/A"
                        }

                      </h4>

                    </div>

                    {/* IMAGES */}
                    <div
                      className="
                        bg-slate-50
                        rounded-2xl
                        p-4
                      "
                    >

                      <ImageIcon
                        size={18}
                        className="
                          text-pink-600
                        "
                      />

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-2
                        "
                      >

                        Images

                      </p>

                      <h4
                        className="
                          font-bold
                          mt-1
                        "
                      >

                        {
                          property.images
                            ?.length || 0
                        }

                      </h4>

                    </div>

                  </div>

                  {/* MODERATION */}
                  <div
                    className="
                      mt-6
                      space-y-4
                    "
                  >

                    {/* PENDING */}
                    {property.status ===
                      "pending" && (

                      <div
                        className="

                          bg-yellow-50

                          border
                          border-yellow-100

                          rounded-2xl

                          p-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            gap-3
                          "
                        >

                          <Lock
                            size={18}
                            className="
                              text-yellow-600
                              mt-0.5
                            "
                          />

                          <div>

                            <p
                              className="
                                font-bold
                                text-yellow-700
                              "
                            >

                              Verification In
                              Progress

                            </p>

                            <p
                              className="
                                text-sm
                                text-yellow-700
                                mt-1
                              "
                            >

                              Editing disabled
                              while under
                              moderation review.

                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* REJECTED */}
                    {property.status ===
                      "rejected" &&
                      property.moderationReason && (

                        <div
                          className="

                            bg-red-50

                            border
                            border-red-100

                            rounded-2xl

                            p-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              mb-2
                            "
                          >

                            <ShieldAlert
                              size={16}
                              className="
                                text-red-600
                              "
                            />

                            <span
                              className="
                                text-sm
                                font-bold
                                text-red-700
                              "
                            >

                              Rejection Reason

                            </span>

                          </div>

                          <p
                            className="
                              text-sm
                              text-red-700
                              leading-relaxed
                            "
                          >

                            {
                              property.moderationReason
                            }

                          </p>

                        </div>
                      )}

                    {/* DATE */}
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        text-sm
                        text-slate-500
                      "
                    >

                      <CalendarDays
                        size={15}
                      />

                      Last updated:

                      {
                        formatDate(
                          property.updatedAt
                        )
                      }

                    </div>

                  </div>

                  {/* ACTION */}
                  <div
                    className="
                      mt-6
                    "
                  >

                    <button

                      onClick={() =>
                        navigate(

                          `/properties/${property._id}`
                        )
                      }

                      className="

                        w-full

                        bg-black
                        hover:bg-slate-800

                        text-white

                        py-4

                        rounded-2xl

                        font-bold

                        flex
                        items-center
                        justify-center
                        gap-2

                        transition
                      "
                    >

                      <Eye
                        size={18}
                      />

                      View Property

                    </button>

                  </div>

                </div>

              </motion.div>
            )
          )}

        </div>
      )}

    </div>
  );
}
