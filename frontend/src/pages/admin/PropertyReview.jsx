import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import { toast } from "react-toastify";

import {

  Loader2,

  MapPin,

  IndianRupee,

  CheckCircle2,

  XCircle,

  Clock3,

  Trash2,

  ShieldAlert,

  Images,

  User2,

  CalendarDays,

  Building2,

  Hash,

  Eye,

  RefreshCcw,

  BadgeCheck,

  ChevronLeft,

  ChevronRight,

  Home,

  Layers3,

  Ruler,

  BadgeInfo,

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
  "https://via.placeholder.com/1200x700?text=Property+Review";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function PropertyReview() {

  // ======================================================
  // ================= PARAMS =============================
  // ======================================================

  const { id } =
    useParams();

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [

    actionLoading,

    setActionLoading,

  ] = useState("");

  const [

    selectedImageIndex,

    setSelectedImageIndex,

  ] = useState(0);

  const [

    fullscreenImage,

    setFullscreenImage,

  ] = useState(null);

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
  // ================= FETCH PROPERTY =====================
  // ======================================================

  const fetchProperty =
    async () => {

      try {

        setLoading(true);
        console.log("Property ID:", id);
        console.log(
          "Fetching URL:",
          `${API_BASE}/property/${id}`
        );

console.log("Token:", token);
        const res =
          await fetch(

            `${API_BASE}/admin/property/${id}`,

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
            "Failed to fetch property"
          );
        }

        setProperty(
          data.property
        );

      } catch (error) {

        console.log(
          error
        );

        console.error(

          "Failed to fetch property review"
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
      status
    ) => {

      try {

        setActionLoading(
          status
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

            `${API_BASE}/admin/property/${id}/status`,

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

        fetchProperty();

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

    fetchProperty();

  }, [id]);

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

                px-4
                py-2

                rounded-full

                text-sm
                font-bold
              "
            >

              APPROVED

            </div>
          );

        case "rejected":

          return (

            <div
              className="

                bg-red-100
                text-red-700

                px-4
                py-2

                rounded-full

                text-sm
                font-bold
              "
            >

              REJECTED

            </div>
          );

        case "deleted":

          return (

            <div
              className="

                bg-black
                text-white

                px-4
                py-2

                rounded-full

                text-sm
                font-bold
              "
            >

              ARCHIVED

            </div>
          );

        default:

          return (

            <div
              className="

                bg-yellow-100
                text-yellow-700

                px-4
                py-2

                rounded-full

                text-sm
                font-bold
              "
            >

              PENDING

            </div>
          );
      }
    };

  // ======================================================
  // ================= IMAGE NAVIGATION ===================
  // ======================================================

  const handleNextImage =
    () => {

      if (
        !property?.images
          ?.length
      ) {

        return;
      }

      setSelectedImageIndex(

        (prev) =>
          prev ===
          property.images
            .length - 1

            ? 0

            : prev + 1
      );
    };

  const handlePrevImage =
    () => {

      if (
        !property?.images
          ?.length
      ) {

        return;
      }

      setSelectedImageIndex(

        (prev) =>
          prev === 0

            ? property.images
                .length - 1

            : prev - 1
      );
    };

  // ======================================================
  // ================= CURRENT IMAGE ======================
  // ======================================================

  const currentImage =

    property?.images?.[
      selectedImageIndex
    ]?.url ||

    FALLBACK_IMAGE;

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
  // ================= LOADING ============================
  // ======================================================

  if (loading) {

    return (

      <div
        className="

          min-h-screen

          bg-slate-100

          flex
          flex-col
          items-center
          justify-center

          gap-5
        "
      >

        <Loader2
          size={50}
          className="
            animate-spin
            text-indigo-600
          "
        />

        <p
          className="
            text-xl
            font-semibold
            text-slate-700
          "
        >

          Loading property review...

        </p>

      </div>
    );
  }

  // ======================================================
  // ================= NO PROPERTY ========================
  // ======================================================

  if (!property) {

    return (

      <div
        className="

          min-h-screen

          bg-slate-100

          flex
          flex-col
          items-center
          justify-center

          px-6

          text-center
        "
      >

        <ShieldAlert
          size={70}
          className="
            text-red-500
          "
        />

        <h2
          className="
            text-3xl
            font-bold
            mt-6
          "
        >

          Property Not Found

        </h2>

        <p
          className="
            text-slate-500
            mt-3
          "
        >

          The requested moderation
          review item could not be
          found.

        </p>

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

      <div
        className="

          bg-gradient-to-r

          from-indigo-600
          via-violet-600
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
          <div>

            <div
              className="
                flex
                items-center
                gap-3
                mb-4
              "
            >

              {getStatusBadge(
                property.status
              )}

              <div
                className="

                  bg-white/15

                  px-4
                  py-2

                  rounded-full

                  text-sm
                  font-bold
                "
              >

                Review Panel

              </div>

            </div>

            <h1
              className="
                text-3xl
                sm:text-4xl
                xl:text-5xl

                font-bold

                leading-tight
              "
            >

              {property.title}

            </h1>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4

                mt-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <Hash size={16} />

                {
                  property.propertyUniqueId
                }

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <MapPin
                  size={16}
                />

                {
                  property.location
                }

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <button

            onClick={
              fetchProperty
            }

            className="

              self-start
              lg:self-auto

              bg-white/15
              hover:bg-white/20

              border
              border-white/20

              px-5
              py-3

              rounded-2xl

              flex
              items-center
              gap-2

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

      </div>

      {/* ====================================================== */}
      {/* ================= MAIN GRID ========================== */}
      {/* ====================================================== */}

      <div
        className="

          grid

          grid-cols-1
          xl:grid-cols-3

          gap-6
          xl:gap-8
        "
      >

        {/* ====================================================== */}
        {/* ================= LEFT SIDE ========================== */}
        {/* ====================================================== */}

        <div
          className="
            xl:col-span-2

            space-y-6
          "
        >

          {/* ====================================================== */}
          {/* ================= IMAGE VIEWER ======================= */}
          {/* ====================================================== */}

          <div
            className="

              bg-white

              rounded-[28px]
              sm:rounded-[36px]

              overflow-hidden

              shadow-sm
            "
          >

            {/* MAIN IMAGE */}
            <div
              className="
                relative
              "
            >

              <img

                src={
                  currentImage
                }

                onError={(
                  e
                ) => {

                  e.target.src =
                    FALLBACK_IMAGE;
                }}

                alt="property"

                className="

                  w-full

                  h-[320px]
                  sm:h-[500px]

                  object-cover
                "
              />

              {/* LEFT */}
              <button

                onClick={
                  handlePrevImage
                }

                className="

                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  bg-black/50
                  hover:bg-black/70

                  text-white

                  p-3

                  rounded-full

                  transition
                "
              >

                <ChevronLeft
                  size={24}
                />

              </button>

              {/* RIGHT */}
              <button

                onClick={
                  handleNextImage
                }

                className="

                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2

                  bg-black/50
                  hover:bg-black/70

                  text-white

                  p-3

                  rounded-full

                  transition
                "
              >

                <ChevronRight
                  size={24}
                />

              </button>

              {/* FULLSCREEN */}
              <button

                onClick={() =>
                  setFullscreenImage(
                    currentImage
                  )
                }

                className="

                  absolute
                  top-4
                  right-4

                  bg-black/50
                  hover:bg-black/70

                  text-white

                  p-3

                  rounded-full

                  transition
                "
              >

                <Eye size={20} />

              </button>

            </div>

            {/* THUMBNAILS */}
            <div
              className="

                flex

                gap-3

                overflow-x-auto

                p-5
              "
            >

              {property.images?.map(
                (
                  image,
                  index
                ) => (

                  <button

                    key={
                      image._id||image.url
                    }

                    onClick={() =>
                      setSelectedImageIndex(
                        index
                      )
                    }

                    className={`

                      min-w-[100px]

                      border-4

                      rounded-2xl

                      overflow-hidden

                      transition

                      ${
                        selectedImageIndex ===
                        index

                          ? "border-indigo-600"

                          : "border-transparent"
                      }
                    `}
                  >

                    <img

                      src={
                        image.url
                      }

                      onError={(
                        e
                      ) => {

                        e.target.src =
                          FALLBACK_IMAGE;
                      }}

                      alt="thumbnail"

                      className="

                        w-[100px]
                        h-[80px]

                        object-cover
                      "
                    />

                  </button>
                )
              )}

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= PROPERTY DETAILS =================== */}
          {/* ====================================================== */}

          <div
            className="

              bg-white

              rounded-[28px]
              sm:rounded-[36px]

              p-5
              sm:p-7

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >

              <Home
                size={24}
                className="
                  text-indigo-600
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >

                Property Information

              </h2>

            </div>

            {/* GRID */}
            <div
              className="

                grid

                grid-cols-2
                lg:grid-cols-4

                gap-4
              "
            >

              {/* PRICE */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                "
              >

                <IndianRupee
                  size={22}
                  className="
                    text-green-600
                  "
                />

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-3
                  "
                >

                  Price

                </p>

                <h3
                  className="
                    font-bold
                    text-lg
                    mt-1
                  "
                >

                  {formatPrice(
                    property.price
                  )}

                </h3>

              </div>

              {/* AREA */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                "
              >

                <Ruler
                  size={22}
                  className="
                    text-blue-600
                  "
                />

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-3
                  "
                >

                  Area

                </p>

                <h3
                  className="
                    font-bold
                    text-lg
                    mt-1
                  "
                >

                  {property.area}{" "}

                  {
                    property.areaUnit
                  }

                </h3>

              </div>

              {/* PRICE PER UNIT */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                "
              >

                <BadgeInfo
                  size={22}
                  className="
                    text-orange-500
                  "
                />

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-3
                  "
                >

                  Price/sqft

                </p>

                <h3
                  className="
                    font-bold
                    text-lg
                    mt-1
                  "
                >

                  ₹

                  {getPricePerUnit(

                    property.price,

                    property.area
                  )}

                </h3>

              </div>

              {/* TYPE */}
              <div
                className="
                  bg-slate-50
                  rounded-3xl
                  p-5
                "
              >

                <Layers3
                  size={22}
                  className="
                    text-violet-600
                  "
                />

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-3
                  "
                >

                  Category

                </p>

                <h3
                  className="
                    font-bold
                    text-lg
                    mt-1
                    capitalize
                  "
                >

                  {
                    property.subType ||
                    "N/A"
                  }

                </h3>

              </div>

            </div>

            {/* DESCRIPTION */}
            <div
              className="
                mt-8
              "
            >

              <h3
                className="
                  text-xl
                  font-bold
                  mb-4
                "
              >

                Description

              </h3>

              <p
                className="
                  text-slate-600
                  leading-relaxed
                "
              >

                {
                  property.description ||

                  "No property description available."
                }

              </p>

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= IMAGE MODERATION =================== */}
          {/* ====================================================== */}

          <div
            className="

              bg-white

              rounded-[28px]
              sm:rounded-[36px]

              p-5
              sm:p-7

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between

                gap-4

                mb-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <ImageIcon
                  size={24}
                  className="
                    text-indigo-600
                  "
                />

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >

                  Image Moderation

                </h2>

              </div>

              <Link

                to={`/admin/property/${property._id}/images`}

                className="

                  bg-indigo-100
                  hover:bg-indigo-200

                  text-indigo-700

                  px-5
                  py-3

                  rounded-2xl

                  font-bold

                  transition
                "
              >

                Open Board

              </Link>

            </div>

            <div
              className="

                grid

                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4

                gap-4
              "
            >

              {property.images?.map(
                (
                  image
                ) => (

                  <div

                    key={
                      image._id
                    }

                    className="
                      relative
                    "
                  >

                    <img

                      src={
                        image.url
                      }

                      onError={(
                        e
                      ) => {

                        e.target.src =
                          FALLBACK_IMAGE;
                      }}

                      alt="property"

                      className="

                        w-full

                        h-[140px]

                        object-cover

                        rounded-2xl
                      "
                    />

                    <div
                      className="
                        absolute
                        bottom-3
                        left-3
                      "
                    >

                      {getStatusBadge(
                        image.status
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* ================= RIGHT SIDEBAR ===================== */}
        {/* ====================================================== */}

        <div
          className="
            space-y-6
          "
        >

          {/* ====================================================== */}
          {/* ================= OWNER CARD ======================== */}
          {/* ====================================================== */}

          <div
            className="

              bg-white

              rounded-[28px]
              sm:rounded-[36px]

              p-5
              sm:p-7

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >

              <User2
                size={24}
                className="
                  text-indigo-600
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >

                Owner Information

              </h2>

            </div>

            <div
              className="
                space-y-5
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Owner Name

                </p>

                <h3
                  className="
                    text-lg
                    font-bold
                    mt-1
                  "
                >

                  {
                    property.ownerName ||
                    "Unknown"
                  }

                </h3>

              </div>

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Role

                </p>

                <h3
                  className="
                    text-lg
                    font-bold
                    mt-1
                    capitalize
                  "
                >

                  {
                    property.createdByRole ||
                    "user"
                  }

                </h3>

              </div>

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Unique Owner ID

                </p>

                <h3
                  className="
                    text-lg
                    font-bold
                    mt-1
                  "
                >

                  {
                    property.ownerUniqueId ||
                    "N/A"
                  }

                </h3>

              </div>

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Created At

                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-2
                  "
                >

                  <CalendarDays
                    size={16}
                  />

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {formatDate(
                      property.createdAt
                    )}

                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= MODERATION ACTIONS ================= */}
          {/* ====================================================== */}

          <div
            className="

              bg-white

              rounded-[28px]
              sm:rounded-[36px]

              p-5
              sm:p-7

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >

              <ShieldAlert
                size={24}
                className="
                  text-indigo-600
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >

                Moderation Controls

              </h2>

            </div>

            <div
              className="
                grid
                gap-4
              "
            >

              {/* APPROVE */}
              <button

                disabled={
                  actionLoading ===
                  "approved"
                }

                onClick={() =>
                  updateStatus(
                    "approved"
                  )
                }

                className="

                  bg-green-600
                  hover:bg-green-700

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

                {actionLoading ===
                "approved" ? (

                  <ButtonLoader />

                ) : (

                  <>

                    <CheckCircle2
                      size={18}
                    />

                    Approve Property

                  </>
                )}

              </button>

              {/* PENDING */}
              <button

                disabled={
                  actionLoading ===
                  "pending"
                }

                onClick={() =>
                  updateStatus(
                    "pending"
                  )
                }

                className="

                  bg-yellow-500
                  hover:bg-yellow-600

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

                {actionLoading ===
                "pending" ? (

                  <ButtonLoader />

                ) : (

                  <>

                    <Clock3
                      size={18}
                    />

                    Move To Pending

                  </>
                )}

              </button>

              {/* REJECT */}
              <button

                disabled={
                  actionLoading ===
                  "rejected"
                }

                onClick={() =>
                  updateStatus(
                    "rejected"
                  )
                }

                className="

                  bg-red-600
                  hover:bg-red-700

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

                {actionLoading ===
                "rejected" ? (

                  <ButtonLoader />

                ) : (

                  <>

                    <XCircle
                      size={18}
                    />

                    Reject Property

                  </>
                )}

              </button>

              {/* DELETE */}
              <button

                disabled={
                  actionLoading ===
                  "deleted"
                }

                onClick={() =>
                  updateStatus(
                    "deleted"
                  )
                }

                className="

                  bg-black
                  hover:bg-slate-900

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

                {actionLoading ===
                "deleted" ? (

                  <ButtonLoader />

                ) : (

                  <>

                    <Trash2
                      size={18}
                    />

                    Archive Property

                  </>
                )}

              </button>

            </div>

          </div>

          {/* ====================================================== */}
          {/* ================= MODERATION STATUS ================== */}
          {/* ====================================================== */}

          <div
            className="

              bg-white

              rounded-[28px]
              sm:rounded-[36px]

              p-5
              sm:p-7

              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-6
              "
            >

              <BadgeCheck
                size={24}
                className="
                  text-indigo-600
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >

                Moderation Status

              </h2>

            </div>

            <div
              className="
                space-y-5
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Current Status

                </p>

                <div
                  className="
                    mt-3
                  "
                >

                  {getStatusBadge(
                    property.status
                  )}

                </div>

              </div>

              {
                (
                  property.rejectionReason ||
                  property.moderationReason
                ) && (

                <div>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >

                    Moderation Reason

                  </p>

                  <div
                    className="

                      bg-red-50

                      border
                      border-red-100

                      rounded-2xl

                      p-4

                      mt-3
                    "
                  >

                    <p
                      className="
                        text-red-700
                        text-sm
                        leading-relaxed
                      "
                    >

                      {
                        property.rejectionReason ||
                        property.moderationReason
                      }

                    </p>

                  </div>

                </div>
              )}

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Last Updated

                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-3
                  "
                >

                  <CalendarDays
                    size={16}
                  />

                  <span
                    className="
                      font-semibold
                    "
                  >

                    {formatDate(
                      property.updatedAt
                    )}

                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= FULLSCREEN MODAL =================== */}
      {/* ====================================================== */}

      {fullscreenImage && (

        <div
          className="

            fixed
            inset-0

            z-50

            bg-black/80

            backdrop-blur-sm

            flex
            items-center
            justify-center

            p-4
          "
        >

          <div
            className="
              relative
              max-w-6xl
              w-full
            "
          >

            {/* CLOSE */}
            <button

              onClick={() =>
                setFullscreenImage(
                  null
                )
              }

              className="

                absolute
                -top-14
                right-0

                bg-white
                hover:bg-slate-100

                text-black

                p-3

                rounded-full

                transition
              "
            >

              <XCircle
                size={24}
              />

            </button>

            {/* IMAGE */}
            <img

              src={
                fullscreenImage
              }

              alt="preview"

              className="

                w-full

                max-h-[85vh]

                object-contain

                rounded-3xl
              "
            />

          </div>

        </div>
      )}

    </div>
  );
}