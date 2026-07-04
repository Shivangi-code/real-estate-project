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

  Building2,

  Search,

  PlusCircle,

  CheckCircle2,

  Clock3,

  XCircle,

  Trash2,

  MapPin,

  IndianRupee,

  Eye,

  Pencil,

  RefreshCcw,

  Activity,

  Radio,

  Layers3,

  Filter,

  ShieldAlert,

  Lock,

  ArrowUpRight,

} from "lucide-react";


// ======================================================
// ================= API ================================
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

export default function BuilderProperties() {

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

    filteredProperties,

    setFilteredProperties,

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

    isRefreshing,

    setIsRefreshing,

  ] = useState(false);

  const [

    liveActivity,

    setLiveActivity,

  ] = useState(null);

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
  // ================= FETCH ==============================
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

        const response =
          await fetch(

            `${import.meta.env.VITE_API_URL}/api/properties/my-properties`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        let propertyData =
          [];

        if (
          data?.properties
        ) {

          propertyData =
            data.properties;

        } else if (
          Array.isArray(
            data
          )
        ) {

          propertyData =
            data;
        }

        // ======================================================
        // ================= BUILDER FILTER =====================
        // ======================================================

        const builderProperties =

          propertyData.filter(
            (
              item
            ) =>

              item?.createdBy ===
                user?._id ||

              item?.ownerId ===
                user?._id ||

              item?.user ===
                user?._id
          );

        setProperties(
          builderProperties
        );

        setFilteredProperties(
          builderProperties
        );

      } catch (
        error
      ) {

        console.log(
          error
        );

        toast.error(

          "Failed to fetch properties"
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

  }, []);

  // ======================================================
  // ================= SOCKET LIVE =======================
  // ======================================================

  useEffect(() => {

    // ======================================================
    // ================= PROPERTY UPDATE ===================
    // ======================================================

    const handlePropertyUpdated =
      async (
        payload
      ) => {

        if (

          payload?.ownerId !==
          user?._id
        ) {

          return;
        }

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

        await fetchProperties(
          true
        );

        setTimeout(() => {

          setLiveActivity(
            null
          );

        }, 5000);
      };

    // ======================================================
    // ================= NOTIFICATION ======================
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
    // ================= SOCKET EVENTS =====================
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
    // ================= CLEANUP ===========================
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
  // ================= FILTER =============================
  // ======================================================

  useEffect(() => {

    let updated =
      [...properties];

    // ======================================================
    // ================= SEARCH =============================
    // ======================================================

    if (
      search.trim()
    ) {

      updated =
        updated.filter(
          (
            item
          ) =>

            item?.title
              ?.toLowerCase()
              .includes(

                search.toLowerCase()
              ) ||

            item?.location
              ?.toLowerCase()
              .includes(

                search.toLowerCase()
              )
        );
    }

    // ======================================================
    // ================= TAB FILTER =========================
    // ======================================================

    if (
      activeTab !==
      "all"
    ) {

      updated =
        updated.filter(
          (
            item
          ) =>

            item?.status ===
            activeTab
        );
    }

    setFilteredProperties(
      updated
    );

  }, [

    properties,

    search,

    activeTab,
  ]);

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

  const formatPrice =
    (
      price
    ) => {

      if (!price)
        return "₹ 0";

      if (
        price >=
        10000000
      ) {

        return `₹ ${(
          price /
          10000000
        ).toFixed(1)} Cr`;
      }

      if (
        price >=
        100000
      ) {

        return `₹ ${(
          price /
          100000
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
  // ================= LOADING ============================
  // ======================================================

  if (
    loading
  ) {

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

            Loading Builder Properties...

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

            Builder CRM

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
                sm:text-5xl
                font-extrabold
                text-slate-900
              "
            >

              Builder Properties

            </h1>

            {isRefreshing && (

              <RefreshCcw
                size={24}
                className="
                  animate-spin
                  text-orange-600
                "
              />
            )}

          </div>

          <p
            className="
              text-slate-500
              mt-4
              max-w-2xl
              leading-7
            "
          >

            Manage your builder inventory,
            track moderation lifecycle,
            monitor approvals and maintain
            realtime visibility across all
            projects.

          </p>

        </div>

        {/* ACTION */}

        <button

          onClick={() =>
            navigate(
              "/add-property"
            )
          }

          className="
            bg-black
            hover:bg-slate-800
            text-white
            px-6
            py-4
            rounded-2xl
            font-semibold
            transition-all
            flex
            items-center
            gap-3
            shadow-lg
            w-fit
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

        {[
          {
            label:
              "Total",
            value:
              counts.total,
            icon:
              <Building2 size={22} />,
            bg:
              "bg-slate-900",
          },

          {
            label:
              "Pending",
            value:
              counts.pending,
            icon:
              <Clock3 size={22} />,
            bg:
              "bg-yellow-500",
          },

          {
            label:
              "Approved",
            value:
              counts.approved,
            icon:
              <CheckCircle2 size={22} />,
            bg:
              "bg-green-600",
          },

          {
            label:
              "Rejected",
            value:
              counts.rejected,
            icon:
              <XCircle size={22} />,
            bg:
              "bg-red-600",
          },

          {
            label:
              "Archived",
            value:
              counts.deleted,
            icon:
              <Trash2 size={22} />,
            bg:
              "bg-slate-700",
          },
        ].map(
          (
            item,
            index
          ) => (

            <motion.div

              key={index}

              whileHover={{

                y: -5,
              }}

              className={`
                ${item.bg}
                text-white
                rounded-3xl
                p-5
                shadow-lg
              `}
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

                    {item.label}

                  </p>

                  <h2
                    className="
                      text-3xl
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

            </motion.div>
          )
        )}

      </div>

      {/* ====================================================== */}
      {/* ================= FILTER BAR ========================= */}
      {/* ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          p-5
          shadow-sm
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

            placeholder="Search builder properties..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="
              w-full
              pl-11
              pr-4
              py-4
              rounded-2xl
              border
              border-slate-200
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        {/* TABS */}

        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-2
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
            label="Deleted"
            value="deleted"
            count={counts.deleted}
          />

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= EMPTY ============================== */}
      {/* ====================================================== */}

      {filteredProperties.length === 0 ? (

        <div
          className="
            bg-white
            rounded-3xl
            p-12
            text-center
            shadow-sm
          "
        >

          <Layers3
            size={60}
            className="
              mx-auto
              text-slate-400
            "
          />

          <h2
            className="
              text-2xl
              font-bold
              mt-6
              text-slate-900
            "
          >

            No Builder Properties Found

          </h2>

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            Try changing filters or
            add a new property.

          </p>

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
                  rounded-[30px]
                  overflow-hidden
                  shadow-sm
                  border
                  border-slate-200
                "
              >

                {/* IMAGE */}

                <img

                  src={
                    property
                      ?.images?.[0] ||

                    property?.image ||

                    FALLBACK_IMAGE
                  }

                  alt={
                    property?.title
                  }

                  className="
                    w-full
                    h-[240px]
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
                      property?.status
                    )}

                    <div
                      className="
                        text-xs
                        font-semibold
                        text-slate-500
                      "
                    >

                      {property?.type ||
                        "Property"}

                    </div>

                  </div>

                  {/* TITLE */}

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-slate-900
                    "
                  >

                    {property?.title}

                  </h2>

                  {/* LOCATION */}

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

                      {property?.location}

                    </span>

                  </div>

                  {/* PRICE */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <IndianRupee
                      size={20}
                      className="
                        text-green-600
                      "
                    />

                    <span
                      className="
                        text-2xl
                        font-extrabold
                        text-slate-900
                      "
                    >

                      {formatPrice(
                        property?.price
                      )}

                    </span>

                  </div>

                  {/* MODERATION */}

                  <div
                    className="
                      mt-5
                      space-y-3
                    "
                  >

                    {property?.status ===
                      "pending" && (

                      <div
                        className="
                          bg-yellow-50
                          border
                          border-yellow-100
                          rounded-2xl
                          p-4
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
                              text-yellow-700
                              font-bold
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

                            Editing locked during moderation.

                          </p>

                        </div>

                      </div>
                    )}

                    {property?.status ===
                      "rejected" &&

                      property?.moderationReason && (

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

                          {
                            property?.moderationReason
                          }

                        </p>

                      </div>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3
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
                        bg-black
                        hover:bg-slate-800
                        text-white
                        py-3
                        rounded-2xl
                        transition-all
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

                      View

                    </button>

                    <button

                      disabled={
                        property?.status ===
                        "pending"
                      }

                      className={`

                        py-3
                        rounded-2xl

                        font-semibold

                        flex
                        items-center
                        justify-center
                        gap-2

                        transition-all

                        ${
                          property?.status ===
                          "pending"

                            ? `

                                bg-slate-200
                                text-slate-500
                                cursor-not-allowed
                              `

                            : `

                                bg-orange-500
                                hover:bg-orange-600
                                text-white
                              `
                        }
                      `}
                    >

                      <Pencil
                        size={18}
                      />

                      Edit

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