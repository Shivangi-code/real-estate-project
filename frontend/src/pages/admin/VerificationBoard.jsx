import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Image as ImageIcon,
  MapPin,
  Hash,
} from "lucide-react";

import { API_URL } from "../../config/api";

export default function VerificationBoard() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // ================= FETCH ==============================
  // ======================================================

  const fetchAll =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `${API_URL}/api/admin/properties/all`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setProperties(
          Array.isArray(
            data
          )
            ? data
            : []
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
  // ================= IMAGE STATUS =======================
  // ======================================================

  const updateImageStatus =
    async (
      propertyId,
      imageId,
      action
    ) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `${API_URL}/api/admin/property-image/${propertyId}/${imageId}/${action}`,
            {
              method:
                "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        if (res.ok) {

          toast.success(
            data.message
          );

          fetchAll();

        } else {

          toast.error(
            data.message
          );
        }

      } catch (error) {

        console.log(
          error
        );

        toast.error(
          "Server error"
        );
      }
    };

  // ======================================================
  // ================= LOAD ===============================
  // ======================================================

  useEffect(() => {

    fetchAll();

  }, []);

  // ======================================================
  // ================= STATS ==============================
  // ======================================================

  const totalImages =
    properties.reduce(
      (
        total,
        property
      ) =>
        total +
        (
          property
            .images ||
          []
        ).length,
      0
    );

  const approvedImages =
    properties.reduce(
      (
        total,
        property
      ) =>
        total +
        (
          property.images ||
          []
        ).filter(
          (img) =>
            img.status ===
            "approved"
        ).length,
      0
    );

  const pendingImages =
    properties.reduce(
      (
        total,
        property
      ) =>
        total +
        (
          property.images ||
          []
        ).filter(
          (img) =>
            img.status ===
            "pending"
        ).length,
      0
    );

  const rejectedImages =
    properties.reduce(
      (
        total,
        property
      ) =>
        total +
        (
          property.images ||
          []
        ).filter(
          (img) =>
            img.status ===
            "rejected"
        ).length,
      0
    );

  // ======================================================
  // ================= CARD ===============================
  // ======================================================

  const StatCard = ({
    icon,
    title,
    value,
    color,
  }) => (

    <div
      className="
        bg-white
        rounded-[24px]
        sm:rounded-3xl
        p-5
        sm:p-6
        shadow-sm
        border
        border-slate-200
      "
    >

      <div className={color}>
        {icon}
      </div>

      <p
        className="
          text-slate-500
          mt-4
          text-sm
          sm:text-base
        "
      >
        {title}
      </p>

      <h2
        className="
          text-3xl
          sm:text-4xl
          font-bold
          mt-2
        "
      >
        {value}
      </h2>

    </div>
  );

  return (

    <div
      className="
        min-h-screen
        bg-slate-100
        p-4
        sm:p-6
        md:p-10
        overflow-x-hidden
      "
    >

      {/* ====================================================== */}
      {/* ================= HEADER ============================= */}
      {/* ====================================================== */}

      <div
        className="
          bg-gradient-to-r
          from-indigo-700
          via-blue-700
          to-slate-900
          rounded-[24px]
          sm:rounded-[32px]
          text-white
          p-5
          sm:p-8
          shadow-xl
          mb-6
          sm:mb-8
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            gap-4
          "
        >

          <ShieldCheck
            className="
              w-10
              h-10
              sm:w-11
              sm:h-11
            "
          />

          <div>

            <h1
              className="
                text-3xl
                sm:text-4xl
                font-bold
              "
            >

              Image Verification Board

            </h1>

            <p
              className="
                text-blue-100
                mt-2
                text-sm
                sm:text-lg
              "
            >

              Moderate and manage property gallery uploads

            </p>

          </div>

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
          sm:mb-10
        "
      >

        <StatCard
          icon={
            <ImageIcon size={34} />
          }
          title="Total Images"
          value={totalImages}
          color="text-blue-600"
        />

        <StatCard
          icon={
            <CheckCircle2 size={34} />
          }
          title="Approved"
          value={approvedImages}
          color="text-green-600"
        />

        <StatCard
          icon={
            <Clock3 size={34} />
          }
          title="Pending"
          value={pendingImages}
          color="text-yellow-500"
        />

        <StatCard
          icon={
            <XCircle size={34} />
          }
          title="Rejected"
          value={rejectedImages}
          color="text-red-600"
        />

      </div>

      {/* ====================================================== */}
      {/* ================= LOADING ============================ */}
      {/* ====================================================== */}

      {loading ? (

        <div
          className="
            text-center
            text-lg
            sm:text-xl
            font-semibold
            py-20
          "
        >

          Loading verification board...

        </div>

      ) : properties.length ===
        0 ? (

        <div
          className="
            bg-white
            rounded-[24px]
            sm:rounded-3xl
            p-8
            sm:p-12
            text-center
            shadow-sm
          "
        >

          <h2
            className="
              text-2xl
              sm:text-3xl
              font-bold
            "
          >

            No Properties Found

          </h2>

          <p
            className="
              text-slate-500
              mt-3
              text-sm
              sm:text-base
            "
          >

            No uploaded properties available for moderation.

          </p>

        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
            sm:gap-6
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
                  rounded-[24px]
                  sm:rounded-[32px]
                  p-4
                  sm:p-6
                  shadow-sm
                  border
                  border-slate-200
                "
              >

                {/* ====================================================== */}
                {/* ================= HEADER ============================= */}
                {/* ====================================================== */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                    gap-4
                    mb-5
                  "
                >

                  <div className="min-w-0">

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-slate-500
                        text-xs
                        sm:text-sm
                        mb-2
                        flex-wrap
                      "
                    >

                      <Hash size={14} />

                      <span
                        className="
                          font-semibold
                          tracking-widest
                          break-all
                        "
                      >

                        {property.propertyUniqueId}

                      </span>

                    </div>

                    <h2
                      className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        line-clamp-2
                      "
                    >

                      {property.title}

                    </h2>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-slate-500
                        mt-2
                        text-sm
                      "
                    >

                      <MapPin size={16} />

                      <span className="line-clamp-1">

                        {property.location}

                      </span>

                    </div>

                  </div>

                  <div
                    className="
                      bg-blue-100
                      text-blue-700
                      px-4
                      py-2
                      rounded-2xl
                      text-sm
                      font-bold
                      w-fit
                    "
                  >

                    {property.images
                      ?.length || 0} Images

                  </div>

                </div>

                {/* ====================================================== */}
                {/* ================= GALLERY ============================ */}
                {/* ====================================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                  "
                >

                  {property.images?.map(
                    (
                      img
                    ) => (

                      <div
                        key={
                          img._id
                        }
                        className="
                          border
                          border-slate-200
                          rounded-2xl
                          overflow-hidden
                          bg-slate-50
                        "
                      >

                        {/* IMAGE */}

                        <img
                          src={
                            img.url
                          }
                          alt="property"
                          className="
                            w-full
                            h-48
                            sm:h-40
                            object-cover
                          "
                        />

                        {/* BODY */}

                        <div className="p-3">

                          {/* STATUS */}

                          <div
                            className={`
                              w-fit
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              mb-4
                              ${
                                img.status ===
                                "approved"
                                  ? "bg-green-100 text-green-700"
                                  : img.status ===
                                      "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }
                            `}
                          >

                            {img.status}

                          </div>

                          {/* BUTTONS */}

                          <div
                            className="
                              flex
                              flex-col
                              sm:flex-row
                              gap-2
                            "
                          >

                            <button
                              onClick={() =>
                                updateImageStatus(
                                  property._id,
                                  img._id,
                                  "approve"
                                )
                              }
                              className="
                                flex-1
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                py-2.5
                                rounded-xl
                                text-xs
                                font-bold
                                transition
                              "
                            >

                              Approve

                            </button>

                            <button
                              onClick={() =>
                                updateImageStatus(
                                  property._id,
                                  img._id,
                                  "reject"
                                )
                              }
                              className="
                                flex-1
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                py-2.5
                                rounded-xl
                                text-xs
                                font-bold
                                transition
                              "
                            >

                              Reject

                            </button>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}