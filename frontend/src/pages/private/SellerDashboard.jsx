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

  Clock3,

  CheckCircle2,

  ArrowUpRight,

  Trash2,

  XCircle,

  ShieldAlert,

  Eye,

  Lock,

  RefreshCcw,

  Activity,

  Radio,

} from "lucide-react";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function SellerDashboard() {

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

    avatarIndex,

    setAvatarIndex,

  ] = useState(0);

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
  // ================= ROLE ===============================
  // ======================================================

  const role =
    user?.role?.toUpperCase() ||

    "SELLER";

  // ======================================================
  // ================= API URL ============================
  // ======================================================

  const API_URL =

    import.meta.env
      .VITE_API_URL ||

    "http://localhost:5000";

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

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(

            `${API_URL}/api/properties/my-properties`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        // ======================================================
        // ================= SAFE ARRAY =========================
        // ======================================================

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

          "Seller Dashboard Error ❌",

          error
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
  // ================= INITIAL LOAD ======================
  // ======================================================

  useEffect(() => {

    fetchProperties();

    // ======================================================
    // ================= AVATAR SWITCH ======================
    // ======================================================

    const avatarInterval =
      setInterval(() => {

        setAvatarIndex(
          (
            prev
          ) =>

            prev === 0
              ? 1
              : 0
        );

      }, 2200);

    return () => {

      clearInterval(
        avatarInterval
      );
    };

  }, []);

  // ======================================================
  // ================= LIVE SOCKET SYNC ==================
  // ======================================================

  useEffect(() => {

    // ======================================================
    // ================= PROPERTY UPDATED ===================
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

            "Property Updated",

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
    // ================= MODERATION =========================
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

  const total =
    properties.length;

  const pending =
    properties.filter(
      (
        property
      ) =>

        property.status ===
        "pending"
    ).length;

  const approved =
    properties.filter(
      (
        property
      ) =>

        property.status ===
        "approved"
    ).length;

  const rejected =
    properties.filter(
      (
        property
      ) =>

        property.status ===
        "rejected"
    ).length;

  const deleted =
    properties.filter(
      (
        property
      ) =>

        property.status ===
        "deleted"
    ).length;

  // ======================================================
  // ================= FORMAT PRICE =======================
  // ======================================================

  const formatPrice =
    (
      price
    ) => {

      if (!price) {

        return "₹ 0";
      }

      if (
        price >=
        10000000
      ) {

        return `₹ ${(
          price / 10000000
        ).toFixed(1)} Cr`;
      }

      if (
        price >=
        100000
      ) {

        return `₹ ${(
          price / 100000
        ).toFixed(1)} L`;
      }

      return `₹ ${price}`;
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
          p-5
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

              {value}

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

  if (
    loading
  ) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-white
          text-slate-900
          text-xl
          font-semibold
        "
      >

        Loading Dashboard...

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
              from-blue-600
              to-indigo-700
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

                  Live Moderation Update

                </h3>

                <p
                  className="
                    text-blue-100
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
          rounded-[28px]
          overflow-hidden
          p-[2px]
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-[conic-gradient(from_0deg,#061a3a,#0b3aa4,#061a3a,#0b3aa4,#061a3a)]
            animate-[spin_4s_linear_infinite]
          "
        />

        <div
          className="
            relative
            rounded-[26px]
            bg-cover
            bg-center
            overflow-hidden
            p-6
            sm:p-10
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

              <div
                className="
                  flex
                  items-center
                  gap-3
                  flex-wrap
                "
              >

                <h1
                  className="
                    text-3xl
                    sm:text-5xl
                    font-extrabold
                    text-blue-100
                  "
                >

                  Welcome back,

                </h1>

                {isRefreshing && (

                  <RefreshCcw
                    size={24}
                    className="
                      text-blue-200
                      animate-spin
                    "
                  />
                )}

              </div>

              <div
                className="
                  mt-5
                  inline-block
                  px-5
                  py-4
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  backdrop-blur-xl
                "
              >

                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    font-extrabold
                    uppercase
                    text-blue-100
                  "
                >

                  {user?.name ||
                    "SELLER"}

                </h2>

                <p
                  className="
                    text-blue-200
                    text-xs
                    tracking-[4px]
                    uppercase
                    mt-1
                    font-semibold
                  "
                >

                  {role}

                </p>

              </div>

              <p
                className="
                  mt-6
                  text-slate-200
                  text-lg
                  leading-8
                  max-w-2xl
                "
              >

                Live moderation tracking,
                instant verification updates,
                and real-time property lifecycle management.

              </p>

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
                    px-6
                    py-4
                    rounded-2xl
                    font-semibold
                    hover:scale-105
                    transition-all
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
                  w-[180px]
                  h-[180px]
                  sm:w-[240px]
                  sm:h-[240px]
                  rounded-full
                  bg-white/10
                  backdrop-blur-2xl
                  border
                  border-white/30
                  flex
                  items-center
                  justify-center
                "
              >

                <motion.img

                  key={
                    avatarIndex
                  }

                  src={
                    avatarIndex === 0

                      ? "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"

                      : "https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
                  }

                  alt="avatar"

                  className="
                    w-28
                    sm:w-44
                    drop-shadow-xl
                  "
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
          mt-8
        "
      >

        <StatCard
          title="Total"
          value={total}
          icon={
            <Building2
              size={24}
            />
          }
          glow="bg-cyan-500"
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={
            <Clock3
              size={24}
            />
          }
          glow="bg-orange-500"
        />

        <StatCard
          title="Approved"
          value={approved}
          icon={
            <CheckCircle2
              size={24}
            />
          }
          glow="bg-emerald-500"
        />

        <StatCard
          title="Rejected"
          value={rejected}
          icon={
            <XCircle
              size={24}
            />
          }
          glow="bg-red-500"
        />

        <StatCard
          title="Archived"
          value={deleted}
          icon={
            <Trash2
              size={24}
            />
          }
          glow="bg-slate-700"
        />

      </div>

      {/* ====================================================== */}
      {/* ================= PROPERTY LIST ====================== */}
      {/* ====================================================== */}

      <div
        className="
          bg-white
          rounded-[28px]
          p-5
          sm:p-7
          mt-8
          border
          border-slate-200
          shadow-lg
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            mb-8
          "
        >

          <h2
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-slate-900
            "
          >

            My Properties

          </h2>

        </div>

        {properties.length === 0 ? (

          <div
            className="
              text-center
              py-16
            "
          >

            <Building2
              size={60}
              className="
                mx-auto
                text-slate-400
              "
            />

            <h3
              className="
                text-2xl
                font-bold
                mt-5
                text-slate-900
              "
            >

              No Properties Yet

            </h3>

            <p
              className="
                text-slate-500
                mt-3
              "
            >

              Start by adding your
              first property listing.

            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              gap-5
            "
          >

            {properties.map(
              (
                item
              ) => (

                <motion.div

                  key={
                    item._id
                  }

                  whileHover={{
                    y: -6,
                  }}

                  className="
                    border
                    border-slate-200
                    rounded-[28px]
                    overflow-hidden
                    bg-white
                    shadow-md
                  "
                >

                  {/* IMAGE */}

                  <img

                    src={
                      item.image
                    }

                    alt={
                      item.title
                    }

                    className="
                      w-full
                      h-[220px]
                      object-cover
                    "
                  />

                  {/* BODY */}

                  <div
                    className="
                      p-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        mb-4
                      "
                    >

                      {getStatusBadge(
                        item.status
                      )}

                      <div
                        className="
                          text-xs
                          text-slate-500
                          font-semibold
                        "
                      >

                        {item.type}

                      </div>

                    </div>

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-slate-900
                      "
                    >

                      {item.title}

                    </h3>

                    <p
                      className="
                        text-slate-600
                        mt-2
                      "
                    >

                      {item.location}

                    </p>

                    <div
                      className="
                        mt-4
                        text-2xl
                        font-extrabold
                        text-slate-900
                      "
                    >

                      {formatPrice(
                        item.price
                      )}

                    </div>

                    {/* MODERATION INFO */}

                    <div
                      className="
                        mt-5
                        space-y-3
                      "
                    >

                      {item.status ===
                        "pending" && (

                        <div
                          className="
                            flex
                            items-start
                            gap-3
                            bg-yellow-50
                            border
                            border-yellow-100
                            rounded-2xl
                            p-4
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
                                text-sm
                              "
                            >

                              Verification In Progress

                            </p>

                            <p
                              className="
                                text-yellow-700
                                text-xs
                                mt-1
                              "
                            >

                              Editing disabled while under moderation.

                            </p>

                          </div>

                        </div>
                      )}

                      {item.status ===
                        "rejected" &&
                        item.moderationReason && (

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
                              "
                            >

                              {item.moderationReason}

                            </p>

                          </div>
                        )}

                    </div>

                    {/* ACTION */}

                    <button

                      onClick={() =>
                        navigate(
                          `/properties/${item._id}`
                        )
                      }

                      className="
                        mt-6
                        w-full
                        bg-black
                        hover:bg-slate-800
                        text-white
                        py-3.5
                        rounded-2xl
                        transition
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >

                      <Eye
                        size={18}
                      />

                      View Property

                    </button>

                  </div>

                </motion.div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}