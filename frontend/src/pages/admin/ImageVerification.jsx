import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {

  Image as ImageIcon,

  CheckCircle2,

  XCircle,

  Trash2,

  RotateCcw,

  Loader2,

  RefreshCcw,

  ShieldAlert,

  Eye,

  Building2,

  CalendarDays,

  User2,

  Hash,

  BadgeCheck,

  Clock3,

} from "lucide-react";

// ======================================================
// ================= API BASE ===========================
// ======================================================

const API_BASE =
  "http://localhost:5000/api/admin";

// ======================================================
// ================= FALLBACK IMAGE =====================
// ======================================================

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x700?text=Property+Image";

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

export default function ImageVerification() {

  // ======================================================
  // ================= SEARCH PARAMS ======================
  // ======================================================

  const [searchParams] =
    useSearchParams();

  const propertyId =
    searchParams.get(
      "property"
    );

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [

    actionLoading,

    setActionLoading,

  ] = useState("");

  const [

    selectedImage,

    setSelectedImage,

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
  // ================= FETCH IMAGES =======================
  // ======================================================

  const fetchImages =
    async () => {

      try {

        setLoading(true);

        let url =
          `${API_BASE}/properties`;

        if (propertyId) {

          url +=
            `?property=${propertyId}`;
        }

        const res =
          await fetch(
            url,
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
            "Failed to fetch image verification data"
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

          "Failed to fetch images"
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // ================= UPDATE IMAGE STATUS ================
  // ======================================================

  const updateImageStatus =
    async (

      propertyId,

      imageId,

      status
    ) => {

      try {

        setActionLoading(
          `${imageId}-${status}`
        );

        let moderationReason =
          "";

        if (
          status ===
          "rejected"
        ) {

          moderationReason =

            window.prompt(
              "Enter image rejection reason"
            ) || "";
        }

        const res =
          await fetch(

            `${API_BASE}/property/${propertyId}/image/${imageId}/status`,

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
            "Image moderation failed"
          );
        }

        toast.success(
          data.message
        );

        fetchImages();

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

    fetchImages();

  }, []);

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
  // ================= IMAGE STATUS BADGE =================
  // ======================================================

  const getImageStatusBadge =
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

              APPROVED

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

              REJECTED

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

              ARCHIVED

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

              PENDING

            </div>
          );
      }
    };

  // ======================================================
  // ================= BUTTON LOADER ======================
  // ======================================================

  const ButtonLoader = () => (

    <Loader2
      size={16}
      className="
        animate-spin
      "
    />
  );

  // ======================================================
  // ================= IMAGE COUNTS =======================
  // ======================================================

  const imageCounts =
    properties.reduce(

      (
        acc,
        property
      ) => {

        property.images?.forEach(
          (
            image
          ) => {

            acc.total += 1;

            if (
              image.status ===
              "approved"
            ) {

              acc.approved += 1;
            }

            else if (
              image.status ===
              "rejected"
            ) {

              acc.rejected += 1;
            }

            else if (
              image.status ===
              "deleted"
            ) {

              acc.deleted += 1;
            }

            else {

              acc.pending += 1;
            }
          }
        );

        return acc;

      },

      {

        total: 0,

        pending: 0,

        approved: 0,

        rejected: 0,

        deleted: 0,

      }
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

              <ImageIcon
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

                Image Verification

              </h1>

              <p
                className="
                  text-indigo-100

                  mt-2

                  text-sm
                  sm:text-base
                  xl:text-lg
                "
              >

                Separate image-level
                moderation workflow

              </p>

            </div>

          </div>

          {/* RIGHT */}
          <button

            onClick={
              fetchImages
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
            border
            border-slate-200
            shadow-sm
          "
        >

          <ImageIcon
            size={30}
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

            {
              imageCounts.total
            }

          </h2>

        </div>

        {/* PENDING */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            border
            border-slate-200
            shadow-sm
          "
        >

          <Clock3
            size={30}
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

            {
              imageCounts.pending
            }

          </h2>

        </div>

        {/* APPROVED */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            border
            border-slate-200
            shadow-sm
          "
        >

          <CheckCircle2
            size={30}
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

            {
              imageCounts.approved
            }

          </h2>

        </div>

        {/* REJECTED */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            border
            border-slate-200
            shadow-sm
          "
        >

          <XCircle
            size={30}
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

            {
              imageCounts.rejected
            }

          </h2>

        </div>

        {/* ARCHIVED */}
        <div
          className="
            bg-white
            rounded-[24px]
            p-5
            border
            border-slate-200
            shadow-sm
          "
        >

          <Trash2
            size={30}
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

            {
              imageCounts.deleted
            }

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
              text-indigo-600
            "
          />

          <p
            className="
              text-lg
              font-semibold
              text-slate-700
            "
          >

            Loading image
            moderation board...

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

          <ImageIcon
            size={54}
            className="
              mx-auto
              text-indigo-500
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

            No Images Found

          </h2>

          <p
            className="
              text-slate-500

              mt-3
            "
          >

            Image moderation
            inventory will appear
            here.

          </p>

        </div>

      ) : (

        <div
          className="
            space-y-8
          "
        >

          {properties.map(
            (
              property
            ) => (

              <div

                key={
                  property._id
                }

                className="

                  bg-white

                  rounded-[28px]
                  sm:rounded-[36px]

                  border
                  border-slate-200

                  shadow-sm

                  overflow-hidden
                "
              >

                {/* ====================================================== */}
                {/* ================= PROPERTY HEADER ==================== */}
                {/* ====================================================== */}

                <div
                  className="

                    border-b
                    border-slate-200

                    p-5
                    sm:p-7
                  "
                >

                  <div
                    className="

                      flex
                      flex-col

                      lg:flex-row
                      lg:items-start
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

                      <h2
                        className="

                          text-2xl
                          sm:text-3xl

                          font-bold
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

                        <MapPin size={16} />

                        {
                          property.location
                        }

                      </div>

                    </div>

                    {/* RIGHT */}
                    <div
                      className="

                        flex
                        flex-col

                        gap-3
                      "
                    >

                      <Link

                        to={`/admin/property/${property._id}`}

                        className="

                          bg-slate-100
                          hover:bg-slate-200

                          text-slate-800

                          px-5
                          py-3

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

                    </div>

                  </div>

                  {/* OWNER */}
                  <div
                    className="

                      mt-6

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
                        flex-col

                        sm:flex-row
                        sm:items-center
                        sm:justify-between

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

                        <div
                          className="
                            flex
                            items-center
                            gap-2

                            mt-2
                          "
                        >

                          <User2
                            size={16}
                          />

                          <span
                            className="
                              font-semibold
                            "
                          >

                            {
                              property
                                ?.createdBy
                                ?.name ||
                              "Unknown User"
                            }

                          </span>

                        </div>

                      </div>

                      <div>

                        <p
                          className="
                            text-sm
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

                </div>

                {/* ====================================================== */}
                {/* ================= IMAGE GRID ========================= */}
                {/* ====================================================== */}

                <div
                  className="

                    grid

                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-3
                    2xl:grid-cols-4

                    gap-5

                    p-5
                    sm:p-7
                  "
                >

                  {property.images?.map(
                    (
                      image
                    ) => {

                      const approveLoading =

                        actionLoading ===
                        `${image._id}-approved`;

                      const pendingLoading =

                        actionLoading ===
                        `${image._id}-pending`;

                      const rejectLoading =

                        actionLoading ===
                        `${image._id}-rejected`;

                      const deleteLoading =

                        actionLoading ===
                        `${image._id}-deleted`;

                      return (

                        <div

                          key={
                            image._id
                          }

                          className="

                            bg-slate-50

                            rounded-[28px]

                            border
                            border-slate-200

                            overflow-hidden

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

                                h-[250px]

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

                              {getImageStatusBadge(

                                image.status
                              )}

                            </div>

                            {/* PREVIEW */}
                            <button

                              onClick={() =>
                                setSelectedImage(
                                  image.url
                                )
                              }

                              className="

                                absolute
                                top-4
                                right-4

                                bg-black/50
                                hover:bg-black/70

                                text-white

                                p-2.5

                                rounded-full

                                transition
                              "
                            >

                              <Eye
                                size={18}
                              />

                            </button>

                          </div>

                          {/* BODY */}
                          <div
                            className="
                              p-5
                            "
                          >

                            {/* REASON */}
                            {image.moderationReason && (

                              <div
                                className="

                                  bg-red-50

                                  border
                                  border-red-100

                                  rounded-2xl

                                  p-4

                                  mb-4
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
                                    image.moderationReason
                                  }

                                </p>

                              </div>
                            )}

                            {/* ACTIONS */}
                            <div
                              className="

                                grid

                                grid-cols-2

                                gap-3
                              "
                            >

                              {/* APPROVE */}
                              <button

                                disabled={
                                  approveLoading
                                }

                                onClick={() =>
                                  updateImageStatus(

                                    property._id,

                                    image._id,

                                    "approved"
                                  )
                                }

                                className="

                                  bg-green-600
                                  hover:bg-green-700

                                  disabled:opacity-60

                                  text-white

                                  py-3

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

                                    <CheckCircle2
                                      size={16}
                                    />

                                    Approve

                                  </>
                                )}

                              </button>

                              {/* PENDING */}
                              <button

                                disabled={
                                  pendingLoading
                                }

                                onClick={() =>
                                  updateImageStatus(

                                    property._id,

                                    image._id,

                                    "pending"
                                  )
                                }

                                className="

                                  bg-yellow-500
                                  hover:bg-yellow-600

                                  disabled:opacity-60

                                  text-white

                                  py-3

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

                                    <Clock3
                                      size={16}
                                    />

                                    Pending

                                  </>
                                )}

                              </button>

                              {/* REJECT */}
                              <button

                                disabled={
                                  rejectLoading
                                }

                                onClick={() =>
                                  updateImageStatus(

                                    property._id,

                                    image._id,

                                    "rejected"
                                  )
                                }

                                className="

                                  bg-red-600
                                  hover:bg-red-700

                                  disabled:opacity-60

                                  text-white

                                  py-3

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

                                    <XCircle
                                      size={16}
                                    />

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
                                  updateImageStatus(

                                    property._id,

                                    image._id,

                                    "deleted"
                                  )
                                }

                                className="

                                  bg-slate-900
                                  hover:bg-black

                                  disabled:opacity-60

                                  text-white

                                  py-3

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

                                    <Trash2
                                      size={16}
                                    />

                                    Archive

                                  </>
                                )}

                              </button>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* ====================================================== */}
      {/* ================= IMAGE PREVIEW MODAL ================ */}
      {/* ====================================================== */}

      {selectedImage && (

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
                setSelectedImage(
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
                selectedImage
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