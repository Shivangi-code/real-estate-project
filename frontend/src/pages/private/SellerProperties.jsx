import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {

  Building2,

  Eye,

  MapPin,

  IndianRupee,

  Clock3,

  CheckCircle2,

  XCircle,

  Trash2,

  ShieldAlert,

  Lock,

  CalendarDays,

  RefreshCcw,

  BadgeInfo,

  Search,

  Layers3,

  Image as ImageIcon,

} from "lucide-react";

// ======================================================
// ================= API BASE ===========================
// ======================================================

const API_BASE =
  "http://localhost:5000/api";

// ======================================================
// ================= FALLBACK IMAGE =====================
// ======================================================

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x700?text=Property";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function SellerProperties() {

  const navigate =
    useNavigate();

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("all");

  // ======================================================
  // ================= TOKEN ==============================
  // ======================================================

  const token =
    useMemo(
      () =>
        localStorage.getItem(
          "token"
        ),
      []
    );

  // ======================================================
  // ================= FETCH PROPERTIES ===================
  // ======================================================

  const fetchProperties =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(

            `${API_BASE}/properties/my-properties`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(

            data.message ||
            "Failed to fetch properties"
          );
        }

        setProperties(

          data.properties || []
        );

      } catch (error) {

        console.log(
          error
        );

        toast.error(

          "Failed to fetch properties"
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // ================= LOAD ===============================
  // ======================================================

  useEffect(() => {

    fetchProperties();

  }, []);

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

      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (
      price >= 100000
    ) {

      return `₹ ${(price / 100000).toFixed(1)} L`;
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
    ).toLocaleString(
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
  // ================= FILTERED PROPERTIES ================
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

              shadow-lg
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

  if (loading) {

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
            size={45}
            className="
              animate-spin
              text-indigo-600
              mx-auto
            "
          />

          <p
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-700
            "
          >

            Loading properties...

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
        xl:p-8

        overflow-x-hidden
      "
    >

      {/* ====================================================== */}
      {/* ================= HEADER ============================= */}
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

          bg-gradient-to-r

          from-slate-900
          via-indigo-900
          to-slate-800

          rounded-[28px]
          sm:rounded-[36px]

          text-white

          p-6
          sm:p-8
          xl:p-10

          shadow-xl

          mb-6
        "
      >

        <div
          className="

            flex
            flex-col

            xl:flex-row
            xl:items-center
            xl:justify-between

            gap-8
          "
        >

          {/* LEFT */}
          <div>

            <div
              className="
                flex
                items-center
                gap-4
                mb-5
              "
            >

              <div
                className="

                  bg-white/10

                  p-4

                  rounded-3xl

                  backdrop-blur-md
                "
              >

                <Building2
                  size={36}
                />

              </div>

              <div>

                <h1
                  className="
                    text-3xl
                    sm:text-5xl
                    font-extrabold
                  "
                >

                  Seller Properties

                </h1>

                <p
                  className="
                    text-slate-300
                    mt-2
                  "
                >

                  Moderation-aware
                  property management
                  system

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <button

            onClick={
              fetchProperties
            }

            className="

              self-start

              bg-white/10
              hover:bg-white/20

              border
              border-white/10

              px-5
              py-3

              rounded-2xl

              flex
              items-center
              gap-3

              font-semibold

              transition
            "
          >

            <RefreshCcw
              size={18}
            />

            Refresh

          </button>

        </div>

      </motion.div>

      {/* ====================================================== */}
      {/* ================= STATS ============================== */}
      {/* ====================================================== */}

      <div
        className="

          grid

          grid-cols-2
          lg:grid-cols-5

          gap-4
          sm:gap-6

          mb-8
        "
      >

        {/* TOTAL */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            shadow-sm
          "
        >

          <Building2
            size={28}
            className="
              text-indigo-600
            "
          />

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            Total

          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-1
            "
          >

            {counts.total}

          </h2>

        </div>

        {/* PENDING */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            shadow-sm
          "
        >

          <Clock3
            size={28}
            className="
              text-yellow-500
            "
          />

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            Pending

          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-1
            "
          >

            {counts.pending}

          </h2>

        </div>

        {/* APPROVED */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            shadow-sm
          "
        >

          <CheckCircle2
            size={28}
            className="
              text-green-600
            "
          />

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            Approved

          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-1
            "
          >

            {counts.approved}

          </h2>

        </div>

        {/* REJECTED */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            shadow-sm
          "
        >

          <XCircle
            size={28}
            className="
              text-red-600
            "
          />

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            Rejected

          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-1
            "
          >

            {counts.rejected}

          </h2>

        </div>

        {/* ARCHIVED */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            shadow-sm
          "
        >

          <Trash2
            size={28}
            className="
              text-slate-700
            "
          />

          <p
            className="
              text-slate-500
              mt-3
            "
          >

            Archived

          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-1
            "
          >

            {counts.deleted}

          </h2>

        </div>

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
      {/* ================= PROPERTY GRID ====================== */}
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

            shadow-sm
          "
        >

          <Building2
            size={60}
            className="
              mx-auto
              text-slate-400
            "
          />

          <h2
            className="
              text-3xl
              font-bold
              mt-5
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

            No properties matched
            your current filters.

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

                  rounded-[28px]

                  overflow-hidden

                  shadow-sm

                  border
                  border-slate-200
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

                  {/* STATUS */}
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
                      "
                    >

                      {formatPrice(
                        property.price
                      )}

                    </h3>

                  </div>

                  {/* PROPERTY INFO */}
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

                    {/* TYPE */}
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

                  {/* MODERATION INFO */}
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

                  {/* ACTIONS */}
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