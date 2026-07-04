import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import {

  CheckCircle2,

  Clock3,

  XCircle,

  MapPin,

  IndianRupee,

  Hash,

  RotateCcw,

  Trash2,

  Loader2,

  RefreshCcw,

  CalendarDays,

  User2,

  Building2,

  ShieldAlert,

  Images,

  Eye,

  BadgeCheck,

} from "lucide-react";

// ======================================================
// ================= API BASE ===========================
// ======================================================

const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;

// ======================================================
// ================= FALLBACK IMAGE =====================
// ======================================================

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x700?text=Deleted+Property";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function DeletedProperties() {

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [properties, setProperties] =
    useState([]);

  const [counts, setCounts] =
    useState({

      total: 0,

      pending: 0,

      approved: 0,

      rejected: 0,

      deleted: 0,

    });

  const [loading, setLoading] =
    useState(true);

  const [

    actionLoading,

    setActionLoading,

  ] = useState("");

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
  // ================= FETCH DELETED ======================
  // ======================================================

  const fetchDeleted =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(

            `${API_BASE}/properties/deleted`,

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
            "Failed to fetch deleted properties"
          );
        }

        // ======================================================
        // ================= SET DATA ============================
        // ======================================================

        setProperties(

          data.properties || []
        );

        setCounts(

          data.counts || {}
        );

      } catch (error) {

        console.log(
          error
        );

        toast.error(

          "Failed to fetch deleted properties"
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // ================= UPDATE STATUS ======================
  // ======================================================

  const updateStatus =
    async (
      propertyId,
      status
    ) => {

      try {

        setActionLoading(
          `${propertyId}-${status}`
        );

        let moderationReason =
          "";

        if (
          status ===
          "rejected"
        ) {

          moderationReason =

            window.prompt(
              "Enter rejection reason"
            ) || "";
        }

        const res =
          await fetch(

            `${API_BASE}/property/${propertyId}/status`,

            {

              method:
                "PATCH",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify({

                status,

                moderationReason,

              }),

            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(

            data.message ||
            "Status update failed"
          );
        }

        toast.success(
          data.message
        );

        fetchDeleted();

      } catch (error) {

        console.log(
          error
        );

        toast.error(

          error.message ||
          "Server Error"
        );

      } finally {

        setActionLoading("");
      }
    };

  // ======================================================
  // ================= LOAD ===============================
  // ======================================================

  useEffect(() => {

    fetchDeleted();

  }, []);

  // ======================================================
  // ================= FORMAT PRICE =======================
  // ======================================================

  const formatPrice = (
    price
  ) => {

    if (!price)
      return "N/A";

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
  // ================= DATE FORMAT ========================
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

        hour: "2-digit",

        minute: "2-digit",

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
  // ================= BUTTON LOADER ======================
  // ======================================================

  const ButtonLoader = () => (

    <Loader2
      size={18}
      className="
        animate-spin
      "
    />
  );

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

      <div
        className="

          bg-gradient-to-r

          from-slate-700
          via-slate-800
          to-black

          rounded-[24px]
          sm:rounded-[36px]

          text-white

          p-5
          sm:p-8
          xl:p-10

          shadow-xl

          mb-6
          sm:mb-8
        "
      >

        <div
          className="

            flex
            flex-col

            lg:flex-row
            lg:items-center
            lg:justify-between

            gap-6
          "
        >

          {/* LEFT */}
          <div
            className="
              flex
              items-start
              sm:items-center
              gap-4
            "
          >

            <div
              className="
                bg-white/15
                backdrop-blur-md

                p-4

                rounded-3xl
              "
            >

              <Trash2
                className="
                  w-9
                  h-9
                  sm:w-11
                  sm:h-11
                "
              />

            </div>

            <div>

              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  xl:text-5xl

                  font-bold
                "
              >

                Deleted Properties

              </h1>

              <p
                className="
                  text-slate-300

                  mt-2

                  text-sm
                  sm:text-base
                  xl:text-lg
                "
              >

                Archived moderation
                inventory with restore
                workflow

              </p>

            </div>

          </div>

          {/* RIGHT */}
          <button

            onClick={
              fetchDeleted
            }

            className="

              self-start
              lg:self-auto

              bg-white/15
              hover:bg-white/20

              border
              border-white/20

              backdrop-blur-md

              px-5
              py-3

              rounded-2xl

              flex
              items-center
              gap-2

              transition
            "
          >

            <RefreshCcw size={18} />

            Refresh

          </button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= STATS ============================== */}
      {/* ====================================================== */}

      <div
        className="

          grid

          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4

          gap-4
          sm:gap-6

          mb-8
        "
      >

        {/* DELETED */}
        <div
          className="

            bg-white

            rounded-[24px]
            sm:rounded-[30px]

            p-5
            sm:p-6

            border
            border-slate-200

            shadow-sm
          "
        >

          <div className="text-slate-700">

            <Trash2 size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Deleted Listings

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {counts.deleted || 0}

          </h2>

        </div>

        {/* RECOVERABLE */}
        <div
          className="

            bg-white

            rounded-[24px]
            sm:rounded-[30px]

            p-5
            sm:p-6

            border
            border-slate-200

            shadow-sm
          "
        >

          <div className="text-green-600">

            <RotateCcw size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Recoverable Listings

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {properties.length}

          </h2>

        </div>

        {/* PENDING */}
        <div
          className="

            bg-white

            rounded-[24px]
            sm:rounded-[30px]

            p-5
            sm:p-6

            border
            border-slate-200

            shadow-sm
          "
        >

          <div className="text-yellow-500">

            <Clock3 size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Pending Inventory

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {counts.pending || 0}

          </h2>

        </div>

        {/* TOTAL */}
        <div
          className="

            bg-white

            rounded-[24px]
            sm:rounded-[30px]

            p-5
            sm:p-6

            border
            border-slate-200

            shadow-sm
          "
        >

          <div className="text-blue-600">

            <Building2 size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Total Inventory

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {counts.total || 0}

          </h2>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= LOADING ============================ */}
      {/* ====================================================== */}

      {loading ? (

        <div
          className="

            bg-white

            rounded-[28px]

            p-10

            flex
            flex-col
            items-center
            justify-center

            gap-4

            shadow-sm
          "
        >

          <Loader2
            size={40}
            className="
              animate-spin
              text-slate-700
            "
          />

          <p
            className="
              text-lg
              font-semibold
              text-slate-700
            "
          >

            Loading deleted properties...

          </p>

        </div>

      ) : properties.length ===
        0 ? (

        <div
          className="

            bg-white

            rounded-[28px]
            sm:rounded-[36px]

            p-8
            sm:p-14

            text-center

            shadow-sm
          "
        >

          <Trash2
            size={54}
            className="
              mx-auto
              text-slate-500
            "
          />

          <h2
            className="
              text-2xl
              sm:text-3xl

              font-bold

              mt-5
            "
          >

            No Deleted Properties

          </h2>

          <p
            className="
              text-slate-500

              mt-3
            "
          >

            Archived moderation
            inventory will appear
            here.

          </p>

        </div>

      ) : (

        <div
          className="

            grid

            grid-cols-1
            2xl:grid-cols-2

            gap-5
            sm:gap-7
          "
        >

          {properties.map(
            (
              property
            ) => {

              const approveLoading =

                actionLoading ===
                `${property._id}-approved`;

              const pendingLoading =

                actionLoading ===
                `${property._id}-pending`;

              const rejectLoading =

                actionLoading ===
                `${property._id}-rejected`;

              return (

                <div

                  key={
                    property._id
                  }

                  className="

                    bg-white

                    rounded-[28px]
                    sm:rounded-[36px]

                    overflow-hidden

                    border
                    border-slate-200

                    shadow-sm

                    hover:shadow-lg

                    transition-all
                    duration-300
                  "
                >

                  {/* ====================================================== */}
                  {/* ================= IMAGE ============================== */}
                  {/* ====================================================== */}

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

                        h-[250px]
                        sm:h-[320px]

                        object-cover

                        grayscale-[25%]
                      "
                    />

                    {/* STATUS */}
                    <div
                      className="

                        absolute
                        top-4
                        left-4

                        bg-black

                        text-white

                        px-4
                        py-2

                        rounded-full

                        text-xs
                        sm:text-sm

                        font-bold

                        shadow-lg
                      "
                    >

                      ARCHIVED

                    </div>

                    {/* IMAGE COUNT */}
                    <div
                      className="

                        absolute
                        top-4
                        right-4

                        bg-black/50

                        backdrop-blur-md

                        text-white

                        px-3
                        py-2

                        rounded-full

                        flex
                        items-center
                        gap-2

                        text-xs
                        sm:text-sm

                        font-semibold
                      "
                    >

                      <Images size={14} />

                      {
                        property
                          ?.images
                          ?.length || 0
                      }

                    </div>

                  </div>

                  {/* ====================================================== */}
                  {/* ================= BODY =============================== */}
                  {/* ====================================================== */}

                  <div
                    className="

                      p-5
                      sm:p-7
                    "
                  >

                    {/* PROPERTY ID */}
                    <div
                      className="

                        flex
                        items-center
                        gap-2

                        text-slate-500

                        text-sm

                        mb-3
                      "
                    >

                      <Hash size={14} />

                      <span
                        className="
                          font-semibold
                          tracking-widest
                        "
                      >

                        {
                          property.propertyUniqueId
                        }

                      </span>

                    </div>

                    {/* TITLE */}
                    <h2
                      className="

                        text-2xl
                        sm:text-3xl

                        font-bold

                        line-clamp-2
                      "
                    >

                      {
                        property.title
                      }

                    </h2>

                    {/* LOCATION */}
                    <div
                      className="

                        flex
                        items-center
                        gap-2

                        text-slate-500

                        mt-4
                      "
                    >

                      <MapPin size={17} />

                      <span
                        className="
                          line-clamp-1
                        "
                      >

                        {
                          property.location
                        }

                      </span>

                    </div>

                    {/* PRICE */}
                    <div
                      className="

                        flex
                        items-center
                        gap-2

                        text-slate-700

                        mt-5
                      "
                    >

                      <span
                        className="

                          text-2xl
                          sm:text-3xl

                          font-bold
                        "
                      >

                        {formatPrice(
                          property.price
                        )}

                      </span>

                    </div>

                    {/* PROPERTY INFO GRID */}
                    <div
                      className="

                        grid

                        grid-cols-2
                        sm:grid-cols-4

                        gap-3

                        mt-6
                      "
                    >

                      {/* AREA */}
                      <div
                        className="
                          bg-slate-50
                          rounded-2xl
                          p-3
                          border
                          border-slate-200
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-slate-500
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
                            property.area || 0
                          }{" "}

                          {
                            property.areaUnit ||
                            "sqft"
                          }

                        </h4>

                      </div>

                      {/* PRICE/SQFT */}
                      <div
                        className="
                          bg-slate-50
                          rounded-2xl
                          p-3
                          border
                          border-slate-200
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-slate-500
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
                          p-3
                          border
                          border-slate-200
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-slate-500
                          "
                        >

                          Type

                        </p>

                        <h4
                          className="
                            font-bold
                            mt-1
                            capitalize
                          "
                        >

                          {
                            property.type ||
                            "N/A"
                          }

                        </h4>

                      </div>

                      {/* CATEGORY */}
                      <div
                        className="
                          bg-slate-50
                          rounded-2xl
                          p-3
                          border
                          border-slate-200
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-slate-500
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

                    </div>

                    {/* ====================================================== */}
                    {/* ================= ARCHIVE NOTE ======================= */}
                    {/* ====================================================== */}

                    <div
                      className="

                        mt-6

                        bg-slate-100

                        border
                        border-slate-200

                        rounded-3xl

                        p-5
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          mb-3
                        "
                      >

                        <ShieldAlert
                          size={18}
                          className="
                            text-slate-700
                          "
                        />

                        <h3
                          className="
                            font-bold
                            text-slate-800
                          "
                        >

                          Archive Status

                        </h3>

                      </div>

                      <p
                        className="
                          text-sm
                          text-slate-700
                          leading-relaxed
                        "
                      >

                        This property is
                        currently archived
                        and hidden from
                        public marketplace
                        visibility.

                      </p>

                    </div>

                    {/* ====================================================== */}
                    {/* ================= GALLERY ============================ */}
                    {/* ====================================================== */}

                    {property.images
                      ?.length > 1 && (

                      <div
                        className="

                          grid

                          grid-cols-2
                          sm:grid-cols-3

                          gap-3

                          mt-6
                        "
                      >

                        {property.images
                          .slice(
                            0,
                            6
                          )
                          .map(
                            (
                              img
                            ) => (

                              <img

                                key={
                                  img._id
                                }

                                src={
                                  img.url
                                }

                                onError={(
                                  e
                                ) => {

                                  e.target.src =
                                    FALLBACK_IMAGE;
                                }}

                                alt="gallery"

                                className="

                                  w-full

                                  h-20
                                  sm:h-24

                                  object-cover

                                  rounded-2xl

                                  border
                                  border-slate-200
                                "
                              />
                            )
                          )}

                      </div>
                    )}

                    {/* ====================================================== */}
                    {/* ================= OWNER ============================== */}
                    {/* ====================================================== */}

                    <div
                      className="

                        mt-7

                        bg-slate-50

                        rounded-3xl

                        p-5

                        border
                        border-slate-200
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div>

                          <p
                            className="
                              text-sm
                              text-slate-500
                            "
                          >

                            Submitted By

                          </p>

                          <h3
                            className="
                              font-bold
                              mt-1
                            "
                          >

                            {
                              property
                                ?.createdBy
                                ?.name ||
                              "Unknown User"
                            }

                          </h3>

                          <div
                            className="
                              flex
                              items-center
                              gap-2

                              text-sm
                              text-slate-500

                              mt-2
                            "
                          >

                            <User2 size={14} />

                            {
                              property
                                ?.createdBy
                                ?.role ||
                              "user"
                            }

                          </div>

                        </div>

                        <div
                          className="
                            text-right
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-slate-500
                            "
                          >

                            Archived On

                          </p>

                          <div
                            className="
                              flex
                              items-center
                              gap-2

                              text-sm
                              text-slate-700

                              mt-2
                            "
                          >

                            <CalendarDays
                              size={14}
                            />

                            {formatDate(

                              property.deletedAt ||

                              property.updatedAt
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ====================================================== */}
                    {/* ================= REVIEW ACTIONS ===================== */}
                    {/* ====================================================== */}

                    <div
                      className="

                        grid

                        grid-cols-1
                        sm:grid-cols-2

                        gap-3

                        mt-6
                      "
                    >

                      {/* REVIEW */}
                      <Link

                        to={`/admin/property/${property._id}`}

                        className="

                          bg-slate-100
                          hover:bg-slate-200

                          text-slate-800

                          py-3.5

                          rounded-2xl

                          font-bold

                          flex
                          items-center
                          justify-center
                          gap-2

                          transition
                        "
                      >

                        <Eye size={18} />

                        Review Property

                      </Link>

                      {/* IMAGES */}
                      <Link

                        to={`/admin/property/${property._id}/images`}

                        className="

                          bg-indigo-100
                          hover:bg-indigo-200

                          text-indigo-700

                          py-3.5

                          rounded-2xl

                          font-bold

                          flex
                          items-center
                          justify-center
                          gap-2

                          transition
                        "
                      >

                        <Images size={18} />

                        Review Images

                      </Link>

                    </div>

                    {/* ====================================================== */}
                    {/* ================= ACTION BUTTONS ===================== */}
                    {/* ====================================================== */}

                    <div
                      className="

                        grid

                        grid-cols-1
                        sm:grid-cols-3

                        gap-3

                        mt-6
                      "
                    >

                      {/* PENDING */}
                      <button

                        disabled={
                          pendingLoading
                        }

                        onClick={() =>
                          updateStatus(

                            property._id,

                            "pending"
                          )
                        }

                        className="

                          bg-yellow-500
                          hover:bg-yellow-600

                          disabled:opacity-60

                          text-white

                          py-3.5

                          rounded-2xl

                          font-bold

                          flex
                          items-center
                          justify-center
                          gap-2

                          transition
                        "
                      >

                        {pendingLoading ? (

                          <ButtonLoader />

                        ) : (

                          <>

                            <Clock3 size={18} />

                            Pending

                          </>
                        )}

                      </button>

                      {/* APPROVE */}
                      <button

                        disabled={
                          approveLoading
                        }

                        onClick={() =>
                          updateStatus(

                            property._id,

                            "approved"
                          )
                        }

                        className="

                          bg-green-600
                          hover:bg-green-700

                          disabled:opacity-60

                          text-white

                          py-3.5

                          rounded-2xl

                          font-bold

                          flex
                          items-center
                          justify-center
                          gap-2

                          transition
                        "
                      >

                        {approveLoading ? (

                          <ButtonLoader />

                        ) : (

                          <>

                            <CheckCircle2 size={18} />

                            Approve

                          </>
                        )}

                      </button>

                      {/* REJECT */}
                      <button

                        disabled={
                          rejectLoading
                        }

                        onClick={() =>
                          updateStatus(

                            property._id,

                            "rejected"
                          )
                        }

                        className="

                          bg-red-600
                          hover:bg-red-700

                          disabled:opacity-60

                          text-white

                          py-3.5

                          rounded-2xl

                          font-bold

                          flex
                          items-center
                          justify-center
                          gap-2

                          transition
                        "
                      >

                        {rejectLoading ? (

                          <ButtonLoader />

                        ) : (

                          <>

                            <XCircle size={18} />

                            Reject

                          </>
                        )}

                      </button>

                    </div>

                    {/* ====================================================== */}
                    {/* ================= RESTORE CTA ======================= */}
                    {/* ====================================================== */}

                    <button

                      disabled={
                        approveLoading
                      }

                      onClick={() =>
                        updateStatus(

                          property._id,

                          "approved"
                        )
                      }

                      className="

                        w-full

                        mt-6

                        bg-slate-900
                        hover:bg-black

                        disabled:opacity-60

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

                      {approveLoading ? (

                        <ButtonLoader />

                      ) : (

                        <>

                          <RotateCcw size={18} />

                          Restore Property

                        </>
                      )}

                    </button>

                    {/* ====================================================== */}
                    {/* ================= ARCHIVE READY ===================== */}
                    {/* ====================================================== */}

                    <div
                      className="

                        mt-6

                        flex
                        items-center
                        gap-2

                        text-sm
                        text-slate-600

                        font-medium
                      "
                    >

                      <BadgeCheck size={16} />

                      Archive recovery workflow active

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}