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
// ================= ICONS ==============================
// ======================================================

import {

  LayoutDashboard,

  Clock3,

  CheckCircle,

  XCircle,

  Trash2,

  Activity,

  TrendingUp,

  ShieldCheck,

  Building2,

  RefreshCcw,

  Radio,

  ArrowUpRight,

} from "lucide-react";

// ======================================================
// ================= SOCKET =============================
// ======================================================

import socket from "../../socket";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function AdminOverview() {

  // ======================================================
  // ================= NAVIGATE ===========================
  // ======================================================

  const navigate =
    useNavigate();

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [

    stats,

    setStats,

  ] = useState({

    total: 0,

    pending: 0,

    approved: 0,

    rejected: 0,

    deleted: 0,
  });

  const [

    loading,

    setLoading,

  ] = useState(true);

  const [

    isRefreshing,

    setIsRefreshing,

  ] = useState(false);

  const [

    liveActivity,

    setLiveActivity,

  ] = useState(null);

  // ======================================================
  // ================= API URL ============================
  // ======================================================

  const API_URL =

    import.meta.env
      .VITE_API_URL ||

    "http://localhost:5000";

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
  // ================= FETCH STATS ========================
  // ======================================================

  const fetchStats =
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

        const response =
          await fetch(

            `${API_URL}/api/admin/stats`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        setStats({

          total:
            data?.total || 0,

          pending:
            data?.pending || 0,

          approved:
            data?.approved || 0,

          rejected:
            data?.rejected || 0,

          deleted:
            data?.deleted || 0,
        });

      } catch (
        error
      ) {

        console.log(

          "Admin Overview Error ❌",

          error
        );

        toast.error(

          "Failed to fetch admin analytics"
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

    fetchStats();

  }, []);

  // ======================================================
  // ================= LIVE SOCKET =======================
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
        // ================= LIVE ACTIVITY ======================
        // ======================================================

        setLiveActivity({

          title:
            payload?.title ||

            "Platform Property Updated",

          status:
            payload?.status ||

            "updated",

          time:
            Date.now(),
        });

        // ======================================================
        // ================= REFRESH STATS ======================
        // ======================================================

        await fetchStats(
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

  }, []);

  // ======================================================
  // ================= PERCENT ============================
  // ======================================================

  const getPercent =
    (
      value
    ) => {

      return stats.total

        ? Math.round(
            (
              value /
              stats.total
            ) * 100
          )

        : 0;
    };

  // ======================================================
  // ================= CARDS ==============================
  // ======================================================

  const cards = [

    {

      title:
        "Total Properties",

      value:
        stats.total,

      icon:
        <LayoutDashboard
          size={24}
        />,

      color:
        "from-slate-800 to-slate-600",

      route:
        "/admin",
    },

    {

      title:
        "Pending",

      value:
        stats.pending,

      icon:
        <Clock3
          size={24}
        />,

      color:
        "from-yellow-500 to-orange-500",

      route:
        "/admin/properties/pending",
    },

    {

      title:
        "Approved",

      value:
        stats.approved,

      icon:
        <CheckCircle
          size={24}
        />,

      color:
        "from-green-500 to-emerald-600",

      route:
        "/admin/properties/approved",
    },

    {

      title:
        "Rejected",

      value:
        stats.rejected,

      icon:
        <XCircle
          size={24}
        />,

      color:
        "from-red-500 to-rose-600",

      route:
        "/admin/properties/rejected",
    },

    {

      title:
        "Deleted",

      value:
        stats.deleted,

      icon:
        <Trash2
          size={24}
        />,

      color:
        "from-slate-600 to-slate-800",

      route:
        "/admin/properties/deleted",
    },
  ];

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
          bg-slate-100
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
            size={44}
            className="
              animate-spin
              text-slate-700
              mx-auto
            "
          />

          <p
            className="
              mt-5
              text-xl
              font-semibold
              text-slate-800
            "
          >

            Loading Admin Overview...

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
        bg-slate-100
        p-4
        sm:p-6
        md:p-8
        overflow-x-hidden
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
              from-slate-800
              to-slate-700
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
                    text-slate-200
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
      {/* ================= HEADER ============================= */}
      {/* ====================================================== */}

      <motion.div

        initial={{

          opacity: 0,

          y: 20,
        }}

        animate={{

          opacity: 1,

          y: 0,
        }}

        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
          mb-8
          sm:mb-10
        "
      >

        <div>

          <p
            className="
              uppercase
              tracking-[5px]
              text-sm
              text-slate-500
              font-semibold
            "
          >

            Admin Analytics

          </p>

          <div
            className="
              flex
              items-center
              gap-4
              flex-wrap
              mt-2
            "
          >

            <h1
              className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                font-extrabold
                text-slate-900
              "
            >

              Platform Overview

            </h1>

            {isRefreshing && (

              <RefreshCcw
                size={24}
                className="
                  animate-spin
                  text-slate-700
                "
              />
            )}

          </div>

          <p
            className="
              text-slate-500
              mt-3
              max-w-2xl
              leading-7
            "
          >

            Monitor realtime moderation,
            platform activity, analytics,
            verification flow and property
            lifecycle management.

          </p>

        </div>

        {/* ====================================================== */}
        {/* ================= LIVE STATUS ======================== */}
        {/* ====================================================== */}

        <div
          className="
            bg-green-100
            text-green-700
            px-5
            py-4
            rounded-2xl
            flex
            items-center
            gap-3
            font-semibold
            w-fit
            shadow-sm
          "
        >

          <div
            className="
              w-3
              h-3
              rounded-full
              bg-green-600
              animate-pulse
            "
          />

          Live Analytics Active

        </div>

      </motion.div>

      {/* ====================================================== */}
      {/* ================= STATS GRID ========================= */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-5
          gap-4
          sm:gap-6
        "
      >

        {cards.map(
          (
            item,
            index
          ) => (

            <motion.div

              key={index}

              whileHover={{

                y: -6,

                scale: 1.02,
              }}

              transition={{
                duration: 0.25,
              }}

              onClick={() =>
                navigate(
                  item.route
                )
              }

              className={`
                bg-gradient-to-br
                ${item.color}
                text-white
                rounded-[24px]
                sm:rounded-3xl
                p-5
                sm:p-6
                shadow-lg
                cursor-pointer
                overflow-hidden
                relative
              `}
            >

              <div
                className="
                  absolute
                  -top-10
                  -right-10
                  w-32
                  h-32
                  rounded-full
                  bg-white/10
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  z-10
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    items-start
                  "
                >

                  <div>

                    <p
                      className="
                        text-sm
                        text-white/80
                      "
                    >

                      {item.title}

                    </p>

                    <h2
                      className="
                        text-3xl
                        sm:text-4xl
                        font-extrabold
                        mt-3
                      "
                    >

                      {item.value}

                    </h2>

                  </div>

                  <div
                    className="
                      bg-white/20
                      p-3
                      rounded-2xl
                    "
                  >

                    {item.icon}

                  </div>

                </div>

                <div
                  className="
                    mt-6
                    text-sm
                    text-white/80
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <TrendingUp
                      size={16}
                    />

                    Realtime Updated

                  </div>

                  <ArrowUpRight
                    size={16}
                  />

                </div>

              </div>

            </motion.div>
          )
        )}

      </div>

      {/* ====================================================== */}
      {/* ================= ANALYTICS ========================== */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-4
          sm:gap-6
          mt-8
          sm:mt-10
        "
      >

        {/* ====================================================== */}
        {/* ================= VERIFICATION HEALTH ================ */}
        {/* ====================================================== */}

        <motion.div

          initial={{

            opacity: 0,

            y: 20,
          }}

          animate={{

            opacity: 1,

            y: 0,
          }}

          transition={{
            delay: 0.1,
          }}

          className="
            xl:col-span-2
            bg-white
            rounded-[24px]
            sm:rounded-3xl
            shadow-sm
            p-5
            sm:p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-8
            "
          >

            <div
              className="
                bg-blue-100
                text-blue-600
                p-3
                rounded-2xl
              "
            >

              <ShieldCheck
                size={22}
              />

            </div>

            <div>

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                "
              >

                Verification Health

              </h2>

              <p
                className="
                  text-slate-500
                  text-sm
                "
              >

                Moderation performance overview

              </p>

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= APPROVED ========================== */}
          {/* ====================================================== */}

          <div className="mb-6">

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                mb-2
              "
            >

              <span
                className="
                  font-medium
                "
              >

                Approved

              </span>

              <span
                className="
                  text-green-600
                  font-bold
                "
              >

                {getPercent(
                  stats.approved
                )}%

              </span>

            </div>

            <div
              className="
                h-3
                bg-slate-200
                rounded-full
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width: `${getPercent(
                    stats.approved
                  )}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                className="
                  h-full
                  bg-green-500
                  rounded-full
                "
              />

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= PENDING =========================== */}
          {/* ====================================================== */}

          <div className="mb-6">

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                mb-2
              "
            >

              <span
                className="
                  font-medium
                "
              >

                Pending

              </span>

              <span
                className="
                  text-yellow-600
                  font-bold
                "
              >

                {getPercent(
                  stats.pending
                )}%

              </span>

            </div>

            <div
              className="
                h-3
                bg-slate-200
                rounded-full
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width: `${getPercent(
                    stats.pending
                  )}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                className="
                  h-full
                  bg-yellow-500
                  rounded-full
                "
              />

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= REJECTED ========================== */}
          {/* ====================================================== */}

          <div className="mb-6">

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                mb-2
              "
            >

              <span
                className="
                  font-medium
                "
              >

                Rejected

              </span>

              <span
                className="
                  text-red-600
                  font-bold
                "
              >

                {getPercent(
                  stats.rejected
                )}%

              </span>

            </div>

            <div
              className="
                h-3
                bg-slate-200
                rounded-full
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width: `${getPercent(
                    stats.rejected
                  )}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                className="
                  h-full
                  bg-red-500
                  rounded-full
                "
              />

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= DELETED =========================== */}
          {/* ====================================================== */}

          <div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                mb-2
              "
            >

              <span
                className="
                  font-medium
                "
              >

                Deleted

              </span>

              <span
                className="
                  text-slate-700
                  font-bold
                "
              >

                {getPercent(
                  stats.deleted
                )}%

              </span>

            </div>

            <div
              className="
                h-3
                bg-slate-200
                rounded-full
                overflow-hidden
              "
            >

              <motion.div

                initial={{
                  width: 0,
                }}

                animate={{
                  width: `${getPercent(
                    stats.deleted
                  )}%`,
                }}

                transition={{
                  duration: 0.8,
                }}

                className="
                  h-full
                  bg-slate-700
                  rounded-full
                "
              />

            </div>

          </div>

        </motion.div>

        {/* ====================================================== */}
        {/* ================= SIDECARD =========================== */}
        {/* ====================================================== */}

        <motion.div

          initial={{

            opacity: 0,

            y: 20,
          }}

          animate={{

            opacity: 1,

            y: 0,
          }}

          transition={{
            delay: 0.2,
          }}

          className="
            bg-gradient-to-br
            from-slate-900
            to-slate-700
            rounded-[24px]
            sm:rounded-3xl
            text-white
            p-5
            sm:p-8
            shadow-lg
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              -top-10
              -right-10
              w-40
              h-40
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
            "
          >

            <div
              className="
                bg-white/10
                w-fit
                p-4
                rounded-2xl
                mb-6
              "
            >

              <Building2
                size={28}
              />

            </div>

            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                leading-tight
              "
            >

              Smart Moderation System

            </h2>

            <p
              className="
                mt-4
                text-slate-300
                leading-7
              "
            >

              Your platform now supports
              realtime moderation,
              analytics, notification sync
              and scalable property lifecycle
              management.

            </p>

            <div
              className="
                mt-8
                space-y-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  sm:text-base
                "
              >

                <Activity
                  size={18}
                />

                Realtime Sync

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  sm:text-base
                "
              >

                <ShieldCheck
                  size={18}
                />

                Verification Tracking

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  sm:text-base
                "
              >

                <TrendingUp
                  size={18}
                />

                Live Analytics

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}