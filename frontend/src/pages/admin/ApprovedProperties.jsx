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

  MapPin,

  IndianRupee,

  Hash,

  BadgeCheck,

  ShieldCheck,

  Eye,

  Building2,

  Images,

  Loader2,

  RefreshCcw,

  User2,

  CalendarDays,

  TrendingUp,

  XCircle,

  Trash2,

} from "lucide-react";


// ======================================================
// ================= API BASE ===========================
// ======================================================

const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;

// ======================================================
// ================= FALLBACK IMAGE =====================
// ======================================================

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x700?text=Approved+Property";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function ApprovedProperties() {

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
  // ================= FETCH APPROVED =====================
  // ======================================================

  const fetchApproved =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(

            `${API_BASE}/properties/approved`,

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
            "Failed to fetch approved properties"
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

          "Failed to fetch approved properties"
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

        const moderationReason =

          status === "rejected"

            ? window.prompt(
                "Enter rejection reason"
              ) || ""

            : "";

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

        fetchApproved();

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

    fetchApproved();

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
      );
    };

  // ======================================================
  // ================= BUSINESS BADGE =====================
  // ======================================================

  const getBusinessBadge =
    (
      businessStatus,
      underNegotiation
    ) => {

      if (
        businessStatus ===
        "sold"
      ) {

        return (

          <div
            className="

              bg-red-100
              text-red-700

              px-4
              py-2

              rounded-full

              text-xs
              sm:text-sm

              font-bold

              shadow-lg
            "
          >

            SOLD

          </div>
        );
      }

      if (
        underNegotiation
      ) {

        return (

          <div
            className="

              bg-yellow-100
              text-yellow-700

              px-4
              py-2

              rounded-full

              text-xs
              sm:text-sm

              font-bold

              shadow-lg
            "
          >

            UNDER NEGOTIATION

          </div>
        );
      }

      return (

        <div
          className="

            bg-green-100
            text-green-700

            px-4
            py-2

            rounded-full

            text-xs
            sm:text-sm

            font-bold

            shadow-lg
          "
        >

          AVAILABLE

        </div>
      );
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

          from-green-600
          via-emerald-600
          to-slate-900

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

              <CheckCircle2
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

                Approved Properties

              </h1>

              <p
                className="
                  text-green-100

                  mt-2

                  text-sm
                  sm:text-base
                  xl:text-lg
                "
              >

                Manage live verified
                marketplace listings

              </p>

            </div>

          </div>

          {/* RIGHT */}
          <button

            onClick={
              fetchApproved
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

          <div className="text-green-600">

            <Building2 size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Total Approved

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {counts.approved || 0}

          </h2>

        </div>

        {/* NEGOTIATION */}
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

            <TrendingUp size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Under Negotiation

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {
              properties.filter(
                (
                  p
                ) =>
                  p.underNegotiation
              ).length
            }

          </h2>

        </div>

        {/* SOLD */}
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

          <div className="text-red-600">

            <ShieldCheck size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Sold Properties

          </p>

          <h2
            className="
              text-3xl
              sm:text-4xl

              font-bold

              mt-2
            "
          >

            {
              properties.filter(
                (
                  p
                ) =>
                  p.businessStatus ===
                  "sold"
              ).length
            }

          </h2>

        </div>

        {/* LIVE */}
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

            <BadgeCheck size={34} />

          </div>

          <p
            className="
              text-slate-500
              mt-4
            "
          >

            Live Listings

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
              text-green-600
            "
          />

          <p
            className="
              text-lg
              font-semibold
              text-slate-700
            "
          >

            Loading approved properties...

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

          <CheckCircle2
            size={54}
            className="
              mx-auto
              text-green-500
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

            No Approved Properties

          </h2>

          <p
            className="
              text-slate-500

              mt-3
            "
          >

            Approved listings
            will appear here.

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

              const rejectLoading =

                actionLoading ===
                `${property._id}-rejected`;

              const deleteLoading =

                actionLoading ===
                `${property._id}-deleted`;

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

                      {getBusinessBadge(

                        property.businessStatus,

                        property.underNegotiation
                      )}

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

                        text-green-700

                        mt-5
                      "
                    >

                      <IndianRupee size={22} />

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

                      {/* PRICE / UNIT */}
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

                      {/* SUBTYPE */}
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

                            Approved By

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

                            Uploaded

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
                              property.createdAt
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

                        to={`/admin/image-verification?property=${property._id}`}

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
                    {/* ================= MODERATION ACTIONS ================= */}
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

                      {/* DELETE */}
                      <button

                        disabled={
                          deleteLoading
                        }

                        onClick={() =>
                          updateStatus(

                            property._id,

                            "deleted"
                          )
                        }

                        className="

                          bg-slate-900
                          hover:bg-black

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

                        {deleteLoading ? (

                          <ButtonLoader />

                        ) : (

                          <>

                            <Trash2 size={18} />

                            Delete

                          </>
                        )}

                      </button>

                    </div>

                    {/* ====================================================== */}
                    {/* ================= LIVE VERIFIED ===================== */}
                    {/* ====================================================== */}

                    <div
                      className="

                        mt-6

                        flex
                        items-center
                        gap-2

                        text-sm
                        text-emerald-600

                        font-medium
                      "
                    >

                      <BadgeCheck size={16} />

                      Live verified listing

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