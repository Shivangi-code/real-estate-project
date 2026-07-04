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

            `${import.meta.env.VITE_API_URL}/api/admin/stats`,

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
              text-slate-300
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

    bg-transparent

    p-5
    lg:p-8

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
justify-between
items-center
flex-wrap

gap-4

mb-6
"
>

        <div>

          <p
            className="
              uppercase
              tracking-[7px]
              text-sm
              text-amber-300
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
                text-white
              "
            >

              Platform Overview

            </h1>

            {isRefreshing && (

              <RefreshCcw
                size={24}
                className="
                  animate-spin
                  text-slate-300
                "
              />
            )}

          </div>

          <p
  className="
    text-slate-500
tracking-wide
    mt-2
    max-w-xl
    leading-6
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
            bg-green-500/10
            border border-green-500/20
            text-green-300
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

              className="
group

relative
overflow-hidden

rounded-[26px]

border
border-white/10

bg-[#0B1523]/95

backdrop-blur-xl

p-6

cursor-pointer

transition-all
duration-500

hover:-translate-y-2

hover:border-amber-400/40

hover:shadow-[0_20px_60px_rgba(251,191,36,.18)]
"
            >

              

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
text-xs

uppercase

tracking-[2px]

text-slate-500
tracking-wide

font-semibold
"
>

                      {item.title}

                    </p>

                    <h2
className="
mt-4

text-4xl
lg:text-5xl

font-bold

tracking-tight

text-white
"
>
                      {item.value}

                    </h2>

                  </div>

                  <div
  className="
  w-14
  h-14

  rounded-full

  flex
  items-center
  justify-center

  bg-gradient-to-br
  from-amber-400/20
  to-transparent

  border
  border-amber-400/25

  text-amber-300

  shadow-[0_0_30px_rgba(251,191,36,.18)]

  transition-all
  duration-500

  group-hover:scale-110
  group-hover:rotate-6
  "
>
  {item.icon}
</div>

                </div>

                <div
className="
mt-8

pt-5

border-t
border-white/8

flex
items-center
justify-between
"
>

                  <div
className="
flex
items-center
gap-2

text-xs

uppercase

tracking-[2px]

text-slate-500
tracking-wide
"
>

                    <TrendingUp
                      size={16}
                    />

                    Realtime Updated

                  </div>

                  <ArrowUpRight
size={18}
className="
text-amber-300

transition-transform
duration-300

group-hover:translate-x-1
group-hover:-translate-y-1
"
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
          mt-6
          sm:mt-6
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

group
relative
overflow-hidden

rounded-[30px]

border
border-amber-400/20

bg-gradient-to-br
from-[#09111d]
via-[#0d1625]
to-[#0b1320]

backdrop-blur-2xl

shadow-[0_25px_80px_rgba(0,0,0,.55)]

p-8
"
        >
         <div
  className="
  absolute
  -top-20
  right-0

  w-72
  h-72

  rounded-full

  bg-amber-400/10

  blur-[100px]
  "
/>

<div
  className="
  absolute
  bottom-0
  left-0

  w-64
  h-64

  rounded-full

  bg-blue-500/10

  blur-[90px]
  "
/> 

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
  w-16
  h-16

  rounded-2xl

  flex
  items-center
  justify-center

  bg-gradient-to-br
  from-amber-400/20
  to-transparent

  border
  border-amber-400/30

  text-amber-300

  shadow-[0_0_30px_rgba(251,191,36,.18)]
  "
>

              <ShieldCheck
                size={22}
              />

            </div>

            <div>

              <h2
className="
text-2xl
font-bold

text-white
"
>

                Verification Health

              </h2>

              <p
                className="
                  text-slate-500
tracking-wide
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
                  text-green-400
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
  mt-3

  h-3

  rounded-full

  bg-white/5

  overflow-hidden

  border
  border-white/10
  "
>

  <motion.div
    initial={{ width:0 }}
    animate={{
      width:`${getPercent(stats.approved)}%`
    }}
    transition={{
      duration:1,
      ease:"easeOut"
    }}
    className="
      relative

      h-full

      rounded-full

      bg-gradient-to-r
      from-emerald-400
      via-green-500
      to-emerald-600

      shadow-[0_0_20px_rgba(16,185,129,.5)]
    "
  >

    <div
      className="
      absolute
      inset-0

      bg-gradient-to-r

      from-white/30
      via-transparent
      to-white/20

      animate-pulse
      "
    />

  </motion.div>

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
                  text-yellow-400
                  font-bold
                "
              >

                {getPercent(
                  stats.pending
                )}%

              </span>

            </div>

            <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">

  <motion.div
    initial={{ width: 0 }}
    animate={{
      width: `${getPercent(stats.pending)}%`,
    }}
    transition={{ duration: 1 }}
    className="
      h-full
      rounded-full
      bg-gradient-to-r
      from-yellow-400
      via-amber-300
      to-yellow-500
      relative
      overflow-hidden
    "
  >

    <motion.div
      animate={{
        x: ["-100%", "220%"],
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
      className="
        absolute
        top-0
        left-0
        h-full
        w-16
        bg-white/30
        blur-sm
        rotate-12
      "
    />

  </motion.div>

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
                  text-red-400
                  font-bold
                "
              >

                {getPercent(
                  stats.rejected
                )}%

              </span>

            </div>

            <div className="mt-3 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">

  <motion.div
    initial={{ width: 0 }}
    animate={{
      width: `${getPercent(stats.rejected)}%`,
    }}
    transition={{
      duration: 1,
      ease: "easeOut",
    }}
    className="
      relative
      h-full
      rounded-full
      bg-gradient-to-r
      from-red-500
      via-rose-400
      to-red-600
      shadow-[0_0_20px_rgba(239,68,68,.45)]
    "
  >
    <div
      className="
        absolute
        inset-0
        bg-gradient-to-r
        from-white/30
        via-transparent
        to-white/20
        animate-pulse
      "
    />
  </motion.div>

</div>

          </div>

          {/* ====================================================== */}
{/* ================= DELETED =========================== */}
{/* ====================================================== */}

<div className="mb-2">

  <div
    className="
      flex
      items-center
      justify-between
      gap-3
      mb-2
    "
  >
    <span className="font-medium">
      Deleted
    </span>

    <span className="text-slate-300 font-bold">
      {getPercent(stats.deleted)}%
    </span>
  </div>

  <div className="mt-3 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">

    <motion.div
      initial={{ width: 0 }}
      animate={{
        width: `${getPercent(stats.deleted)}%`,
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
      className="
        relative
        h-full
        rounded-full
        bg-gradient-to-r
        from-slate-500
        via-slate-300
        to-slate-600
        shadow-[0_0_20px_rgba(148,163,184,.35)]
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-white/30
          via-transparent
          to-white/20
          animate-pulse
        "
      />
    </motion.div>

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
group

relative
overflow-hidden

rounded-[30px]

bg-gradient-to-br
from-[#09111d]
via-[#10192b]
to-[#0b1320]

border
border-amber-400/20

text-white

p-7

shadow-[0_25px_80px_rgba(0,0,0,.55)]

transition-all
duration-500

hover:border-amber-400/40
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
{/* Animated Border */}
<div
  className="
  absolute
  inset-0

  rounded-[26px]

  opacity-0

  group-hover:opacity-100

  transition-opacity
  duration-500

  pointer-events-none
  "
>
  <div
    className="
    absolute
    inset-0

    rounded-[26px]

    border

    border-amber-400/40

    shadow-[0_0_40px_rgba(251,191,36,.18)]
    "
  />
</div>
<div
  className="
absolute

-top-24
-right-20

w-52
h-52

rounded-full

bg-amber-400/10

blur-[90px]

opacity-0

group-hover:opacity-100

transition-all
duration-700
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
  w-16
  h-16

  rounded-2xl

  flex
  items-center
  justify-center

  bg-gradient-to-br
  from-amber-400/20
  to-transparent

  border
  border-amber-400/30

  text-amber-300

  shadow-[0_0_35px_rgba(251,191,36,.2)]

  group-hover:scale-110

  transition-all
  duration-500
  "
>

              <Building2
                size={28}
              />

            </div>

            <h2
              className="
              text-3xl
              font-bold
              text-white
              leading-tight
              "
            >

              Smart Moderation System

            </h2>
            <div
  className="
  mt-4

  inline-flex
  items-center
  gap-2

  px-3
  py-1.5

  rounded-full

  bg-green-500/10

  border
  border-green-500/20

  text-green-400

  text-xs

  uppercase

  tracking-[2px]
  "
>
    ● AI Active
</div>

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