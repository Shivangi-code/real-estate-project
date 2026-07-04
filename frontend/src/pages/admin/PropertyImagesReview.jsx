import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function PropertyImagesReview() {

  // ======================================================
  // ================= ROUTE PARAM =========================
  // ======================================================

  const { id } = useParams();

  // ======================================================
  // ================= STATES ==============================
  // ======================================================

  const [loading, setLoading] =
    useState(true);

  const [property, setProperty] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(0);
  
  // ======================================================
  // ================= IMAGE LOADING =======================
  // ======================================================
  const [imageLoading, setImageLoading] =
    useState(true);  
  // ======================================================
  // ================= FULLSCREEN ==========================
  // ======================================================

  const [fullscreen, setFullscreen] =
    useState(false);  

  // ======================================================
  // ================= REJECT MODAL ========================
  // ======================================================

  const [showRejectModal, setShowRejectModal] =
   useState(false);

  const [rejectionReason, setRejectionReason] =
   useState("");

  const [moderationNote, setModerationNote] =
   useState("");

  // ======================================================
  // ================= API ================================
  // ======================================================

  const API_BASE =
    "http://localhost:5000/api";

  const token =
    localStorage.getItem("token");

  // ======================================================
  // ================= FETCH PROPERTY ======================
  // ======================================================

  const fetchProperty =
    async () => {

      try {

        setLoading(true);

        console.log(
          "Fetching Property Images:",
          id
        );

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

        setSelectedImage(0);
        console.log(
            "PROPERTY DATA:",
            data.property
        );
      } catch (error) {

        console.log(
          "Property Images Error:",
          error
        );

        toast.error(

          error.message ||

          "Failed to load property images"

        );

      } finally {

        setLoading(false);

      }

    };

    // ======================================================
    // ================= LOAD PROPERTY =======================
    // ======================================================

    useEffect(() => {

        if (!id || !token) return;

        fetchProperty();

    }, [id, token]);

    // ======================================================
    // ================= KEYBOARD NAVIGATION =================
    // ======================================================

    useEffect(() => {

    const handleKeyDown = (event) => {

        switch (event.key) {

            case "ArrowLeft":

            handlePrevious();

            break;

            case "ArrowRight":

            handleNext();

            break;

            case "Escape":

            setFullscreen(false);

            break;

            default:

            break;

        }
    };

    window.addEventListener(

        "keydown",

        handleKeyDown

    );

    return () => {

        window.removeEventListener(

        "keydown",

        handleKeyDown

        );

    };

    }, [

    selectedImage,
    property,
    fullscreen
    ]);

    // ======================================================
    // ================= IMAGE TRANSITION ====================
    // ======================================================

    useEffect(() => {

    setImageLoading(true);

    }, [

    selectedImage

    ]);

    // ======================================================
    // ================= IMAGE NAVIGATION ====================
    // ======================================================

    const handlePrevious = () => {

      if (selectedImage > 0) {

        setSelectedImage(

          selectedImage - 1

        );

      }

    };

    const handleNext = () => {

      if (

        selectedImage <

        (property.images?.length || 0) - 1

      ) {

        setSelectedImage(

          selectedImage + 1

        );

      }

    };

    // ======================================================
    // ================= UPDATE IMAGE STATUS =================
    // ======================================================

    const updateImageStatus = async (
    status,
    moderationReason = "",
    moderationNote = ""
    ) => {

    try {

        const imageId =
        property.images[selectedImage]._id;

        const response =
        await fetch(

            `${API_BASE}/admin/image/${property._id}/${imageId}/status`,

            {

            method: "PATCH",

            headers: {

                "Content-Type":
                "application/json",

                Authorization:
                `Bearer ${token}`,

            },

            body: JSON.stringify({

                status,

                moderationReason,

                moderationNote,

            }),

            }

        );

        const data =
        await response.json();

        if (!response.ok) {

        throw new Error(

            data.message ||

            "Failed to update image"

        );

        }

        // ======================================================
        // ================= INSTANT UI UPDATE ===================
        // ======================================================

        if (data.property) {

        setProperty(data.property);

        }

        toast.success(data.message);

        return true;

    } catch (error) {

        console.error(error);

        toast.error(

        error.message

        );

        return false;

    }

    };

    // ======================================================
    // ================= LOADING =============================
    // ======================================================

    if (loading) {

        return (

            <div
            className="
                flex
                items-center
                justify-center
                min-h-[70vh]
                text-lg
                font-semibold
                text-slate-600
                "
                >

                Loading property images...

            </div>

        );
    }

    // ======================================================
    // ================= PROPERTY NOT FOUND ==================
    // ======================================================

    if (!property) {

        return (

            <div
                className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    min-h-[70vh]
                    gap-4
                "
                >

                <h2
                    className="
                    text-2xl
                    font-bold
                    "
                >

                    Property Not Found

                </h2>

                <Link
                    to="/admin/properties/pending"
                    className="
                    px-5
                    py-2
                    rounded-lg
                    bg-slate-900
                    text-white
                    "
                >

                    Go Back

                </Link>

            </div>

        );

    }

    // ======================================================
    // ================= CURRENT IMAGE STATUS ================
    // ======================================================

    const currentStatus =
    property.images?.[selectedImage]?.status;

    return (

        <div
            className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-6
            "
        >

    {/* Back Button */}

    <Link
      to={`/admin/property/${id}`}
      className="
        inline-flex
        items-center
        gap-2
        text-blue-600
        hover:text-blue-800
        font-medium
        mb-6
      "
    >

      <ArrowLeft size={20} />

      Back to Property Review

    </Link>

    {/* Title */}

    <h1
      className="
        text-2xl
        md:text-3xl
        font-bold
        text-slate-900
      "
    >

      {property.title}

    </h1>

    {/* ====================================================== */}
    {/* ================= IMAGE VIEWER ======================== */}
    {/* ====================================================== */}

    {/* ================= MAIN IMAGE  ======================== */}
    <div
      className="
        relative
        mt-6
        rounded-2xl
        overflow-hidden
        border
        border-slate-200
        bg-white
      "
    >
    
    {/* ====================================================== */}
    {/* ================= FULLSCREEN BUTTON =================== */}
    {/* ====================================================== */}

    <button

    type="button"
    onClick={() =>
        setFullscreen(true)
    }
    className="
        absolute
        top-4
        right-4
        z-20
        w-12
        h-12
        rounded-full
        bg-white/85
        backdrop-blur-md
        shadow-lg
        border
        border-slate-200
        flex
        items-center
        justify-center
        text-xl
        font-semibold
        hover:bg-white
        hover:scale-105
        transition-all
        duration-200
    "
    >

    ⛶

    </button>

    {property.images?.length > 0 ? (
    <>
      <img

        src={
          property.images?.[
            selectedImage
          ]?.url
        }

        alt={property.title}

        onLoad={() =>
            setImageLoading(false)
        }

        onDoubleClick={() =>
            setFullscreen(true)
        }

        className={`
          w-full
          h-[40vh]
          md:h-[55vh]
          lg:h-[70vh]
          object-contain
          bg-slate-100
          transition-all
          duration-300
          ease-in-out
        
         ${
           imageLoading
            ? "opacity-0 scale-[0.98]"
            : "opacity-100 scale-100"
          }
        `}

      />
        
        {/* ====================================================== */}
        {/* ================= LEFT NAVIGATION ===================== */}
        {/* ====================================================== */}

        <button

        type="button"

        onClick={handlePrevious}

        disabled={
            property.images?.length === 0 ||
            selectedImage === 0
        }

        className="
            absolute

            left-4

            top-[58%]

            -translate-y-1/2

            z-20

            w-12

            h-12

            rounded-full

            bg-white/85

            backdrop-blur-md

            border

            border-slate-200

            shadow-lg

            flex

            items-center

            justify-center

            text-xl

            hover:bg-white

            hover:scale-105

            transition-all

            duration-200

            disabled:opacity-40

            disabled:cursor-not-allowed
        "

        >

        <ChevronLeft size={28} />

        </button>

        {/* ====================================================== */}
        {/* ================= RIGHT NAVIGATION ==================== */}
        {/* ====================================================== */}

        <button

        type="button"

        onClick={handleNext}

        disabled={

            property.images?.length === 0 ||

            selectedImage ===

            (property.images?.length || 0) - 1

        }

        className="
            absolute

            right-4

            top-[58%]

            -translate-y-1/2

            z-20

            w-12

            h-12

            rounded-full

            bg-white/85

            backdrop-blur-md

            border

            border-slate-200

            shadow-lg

            flex

            items-center

            justify-center

            text-xl

            hover:bg-white

            hover:scale-105

            transition-all

            duration-200

            disabled:opacity-40

            disabled:cursor-not-allowed
        "

        >

        <ChevronRight size={28} />

        </button>
    </>
    ) : (
      <div
        className="
          flex
          items-center
          justify-center
          h-[40vh]
          md:h-[55vh]
          lg:h-[70vh]
          text-slate-500
          font-medium
        "
      >

        No Images Available

      </div>
    )}
    
    </div>
    {/* ====================================================== */}
    {/* ================= IMAGE NAVIGATION BUTTONS ==================== */}
    {/* ====================================================== */}


    {/* Counter */}

    <p
      className="
        mt-4
        text-center
        text-slate-600
        font-medium
      "
    >

      Image

      {" "}

      {selectedImage + 1}

      {" of "}

      {property.images?.length || 0}

    </p>
    {/* ====================================================== */}
    {/* ================= THUMBNAILS ========================== */}
    {/* ====================================================== */}

    <div
    className="
        mt-6
        flex
        gap-3
        overflow-x-auto
        pb-2
    "
    >

    {property.images?.map(

        (image, index) => (

        <button

            key={index}

            onClick={() =>
            setSelectedImage(index)
            }

            className={`
            flex-shrink-0
            rounded-xl
            overflow-hidden
            border-2
            transition-all
            duration-200

            ${
                selectedImage === index
                ? "border-blue-600"
                : "border-slate-200 hover:border-slate-400"
            }
            `}

        >

            <img

            src={image.url}

            alt={`Thumbnail ${index + 1}`}

            className="
                w-24
                h-20
                object-cover
            "

            />

        </button>

        )

    )}

    </div>


    {/* ====================================================== */}
    {/* ================= IMAGE METADATA ====================== */}
    {/* ====================================================== */}

    <div
        className="
            mt-8
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
            p-6
        "
    >

    <h2
        className="
        text-xl
        font-bold
        text-slate-900
        mb-6
        "
    >

        Image Information

    </h2>

        <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            "
        >

            {/* Filename */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Filename

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                break-all
                "
            >

                {property.images?.[selectedImage]?.filename || "N/A"}

            </p>

            </div>

            {/* Status */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Status

            </p>

            <p
                className="
                font-semibold
                capitalize
                text-slate-900
                "
            >

                {property.images?.[selectedImage]?.status || "N/A"}

            </p>

            </div>

            {/* Image Number */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Image Number

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                "
            >

                {selectedImage + 1} of {property.images?.length || 0}

            </p>

            </div>

            {/* Uploaded By */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Uploaded By

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                break-all
                "
            >

                {property.images?.[selectedImage]?.uploadedBy?.name || "N/A"}

            </p>

            </div>

            {/* Role */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Role

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                capitalize
                "
            >

                {property.images?.[selectedImage]?.uploadedBy?.role || "N/A"}

            </p>

            </div>

            {/* User ID */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                User ID

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                "
            >

                {property.images?.[selectedImage]?.uploadedBy?.userUniqueId || "N/A"}

            </p>

            </div>
            
            {/* Uploaded On */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Uploaded On

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                "
            >

                {property.images?.[selectedImage]?.createdAt
                ? new Date(
                    property.images[selectedImage].createdAt
                    ).toLocaleString()
                : "N/A"}

            </p>

            </div>

            {/* Approved On */}

            <div>

            <p
                className="
                text-sm
                text-slate-500
                mb-1
                "
            >

                Approved On

            </p>

            <p
                className="
                font-semibold
                text-slate-900
                "
            >

                {property.images?.[selectedImage]?.approvedAt
                ? new Date(
                    property.images[selectedImage].approvedAt
                    ).toLocaleString()
                : "Not Approved"}

            </p>

            </div>

        </div>
        {/* ====================================================== */}
        {/* ================= REJECT MODAL ======================== */}
        {/* ====================================================== */}

        {showRejectModal && (

        <div
            className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
            p-4
            "
        >

            <div
            className="
                w-full
                max-w-lg
                rounded-2xl
                bg-white
                shadow-2xl
                p-6
            "
            >

            <h2
                className="
                text-2xl
                font-bold
                text-slate-900
                mb-6
                "
            >

                Reject Image

            </h2>
            {/* ====================================================== */}
            {/* ================= REJECTION REASON ==================== */}
            {/* ====================================================== */}

            <div className="mb-5">

            <label
                className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
                "
            >

                Rejection Reason
                <span className="text-red-500"> *</span>

            </label>

            <input

                type="text"

                value={rejectionReason}

                onChange={(e) =>
                setRejectionReason(
                    e.target.value
                )
                }

                placeholder="Enter rejection reason"

                className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-red-500
                focus:ring-2
                focus:ring-red-200
                "

            />

            </div>

            {/* ====================================================== */}
            {/* ================= MODERATION NOTE ===================== */}
            {/* ====================================================== */}

            <div>

            <label
                className="
                block
                text-sm
                font-semibold
                text-slate-700
                mb-2
                "
            >

                Moderation Note

            </label>

            <textarea

                rows={4}

                value={moderationNote}

                onChange={(e) =>
                setModerationNote(
                    e.target.value
                )
                }

                placeholder="Optional note"

                className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                resize-none
                focus:border-red-500
                focus:ring-2
                focus:ring-red-200
                "

            />

            </div>
            {/* ====================================================== */}
            {/* ================= ACTION BUTTONS ====================== */}
            {/* ====================================================== */}

            <div
            className="
                flex
                justify-end
                gap-3
                mt-8
            "
            >

            {/* Cancel */}

            <button

                type="button"

                onClick={() => {

                setShowRejectModal(false);

                setRejectionReason("");

                setModerationNote("");

                }}

                className="
                px-6
                py-3
                rounded-xl
                border
                border-slate-300
                text-slate-700
                font-semibold
                hover:bg-slate-100
                transition-all
                "

            >

                Cancel

            </button>

            {/* Reject */}

            <button

                type="button"

                onClick={async () => {

                if (
                    !rejectionReason.trim()
                ) {

                    toast.error(
                    "Rejection reason is required."
                    );

                    return;

                }

                await updateImageStatus(

                    "rejected",

                    rejectionReason,

                    moderationNote

                );

                setShowRejectModal(false);

                setRejectionReason("");

                setModerationNote("");

                }}

                className="
                px-6
                py-3
                rounded-xl
                bg-red-600
                text-white
                font-semibold
                hover:bg-red-700
                transition-all
                "

            >

                Reject Image

            </button>

            </div>
            </div>

        </div>

        )}
    </div>

    {/* ====================================================== */}
    {/* ================= IMAGE MODERATION ==================== */}
    {/* ====================================================== */}

    <div
    className="
        mt-8
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-6
    "
    >

    <h2
        className="
        text-xl
        font-bold
        text-slate-900
        mb-6
        "
    >

        Image Moderation

    </h2>

    {/* ====================================================== */}
    {/* ================= CURRENT STATUS ====================== */}
    {/* ====================================================== */}

    <div
    className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
        mb-8
        pb-6
        border-b
        border-slate-200
    "
    >

    <div>

        <p
        className="
            text-sm
            text-slate-500
            mb-2
        "
        >

        Current Status

        </p>

        <span
        className={`
            inline-flex
            items-center
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
            border

            ${
            property.images?.[selectedImage]?.status === "approved"

                ? "bg-emerald-100 text-emerald-700 border-emerald-200"

                : property.images?.[selectedImage]?.status === "pending"

                ? "bg-amber-100 text-amber-700 border-amber-200"

                : property.images?.[selectedImage]?.status === "rejected"

                ? "bg-red-100 text-red-700 border-red-200"

                : "bg-slate-200 text-slate-700 border-slate-300"
            }
        `}
        >

        {property.images?.[selectedImage]?.status?.toUpperCase()}

        </span>

    </div>

    <div
        className="
        text-right
        "
    >

        <p
        className="
            text-sm
            text-slate-500
        "
        >

        Selected Image

        </p>

        <p
        className="
            font-bold
            text-slate-900
            text-lg
        "
        >

        {selectedImage + 1} / {property.images?.length}

        </p>

    </div>

    </div>

    {/* ====================================================== */}
    {/* ================= MODERATION INFORMATION ============== */}
    {/* ====================================================== */}

    <div
    className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        mb-8
    "
    >

    {/* Last Moderated */}

    <div>

        <p
        className="
            text-sm
            text-slate-500
            mb-1
        "
        >

        Last Moderated

        </p>

        <p
        className="
            font-semibold
            text-slate-900
        "
        >

        {property.images?.[selectedImage]?.lastModeratedAt

            ? new Date(
                property.images[selectedImage].lastModeratedAt
            ).toLocaleString()

            : "Never"}

        </p>

    </div>

    {/* Moderated By */}

    <div>

        <p
        className="
            text-sm
            text-slate-500
            mb-1
        "
        >

        Moderated By

        </p>

        <p
        className="
            font-semibold
            text-slate-900
        "
        >

        {property.images?.[selectedImage]?.lastModeratedBy?.name || "N/A"}

        </p>

    </div>

    {/* Rejection Reason */}

    <div>

        <p
        className="
            text-sm
            text-slate-500
            mb-1
        "
        >

        Rejection Reason

        </p>

        <p
        className="
            font-semibold
            text-slate-900
            break-words
        "
        >

        {property.images?.[selectedImage]?.rejectionReason || "—"}

        </p>

    </div>

    {/* Moderation Note */}

    <div>

        <p
        className="
            text-sm
            text-slate-500
            mb-1
        "
        >

        Moderation Note

        </p>

        <p
        className="
            font-semibold
            text-slate-900
            break-words
        "
        >

        {property.images?.[selectedImage]?.moderationNote || "—"}

        </p>

    </div>

    </div>

    {/* ====================================================== */}
    {/* ================= MODERATION ACTIONS ================== */}
    {/* ====================================================== */}
    
    <div
    className="
        border-t
        border-slate-200
        pt-6
    "
    >

    <h3
        className="
        text-lg
        font-bold
        text-slate-900
        mb-5
        "
    >

        Moderation Actions

    </h3>

    <div
    className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-4
    "
    >

    {currentStatus !== "approved" && (

        <button
            type="button"
            onClick={() =>
                updateImageStatus("approved")
            }
            className="
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            rounded-xl
            py-3
            font-semibold
            transition-all
            "
        >

            Approve

        </button>

    )}

    {currentStatus !== "pending" && (

        <button
            type="button"
            onClick={() =>
                updateImageStatus("pending")
            }
            className="
            bg-amber-500
            hover:bg-amber-600
            text-white
            rounded-xl
            py-3
            font-semibold
            transition-all
            "
        >

            Pending

        </button>

    )}

    {currentStatus !== "rejected" && (

        <button
            type="button"

            onClick={() =>{
                console.log("Reject Clicked");
                setShowRejectModal(true)
            }}

            className="
            bg-red-600
            hover:bg-red-700
            text-white
            rounded-xl
            py-3
            font-semibold
            transition-all
            "
        >

            Reject

        </button>

    )}

    {currentStatus !== "deleted" && (

        <button
            type="button"
            onClick={() =>
                updateImageStatus("deleted")
            }
            className="
            bg-slate-700
            hover:bg-slate-800
            text-white
            rounded-xl
            py-3
            font-semibold
            transition-all
            "
        >

            Delete

        </button>

    )}

    </div>

    </div>

    </div>

    



    {/* ====================================================== */}
    {/* ================= FULLSCREEN VIEWER =================== */}
    {/* ====================================================== */}

    {fullscreen && (

    <div
        className="
        fixed
        inset-0
        z-[9999]
        bg-black/95
        flex
        items-center
        justify-center
        "
    >

        {/* Close Button */}

        <button

        onClick={() =>
            setFullscreen(false)
        }

        className="
            absolute
            top-6
            right-6
            w-12
            h-12
            rounded-full
            bg-white/20
            hover:bg-white/30
            text-white
            text-2xl
            transition
        "

        >

        ✕

        </button>

        <div
            className="
                absolute
                top-6
                left-6
                text-white/70
                text-sm
                font-medium
                select-none
            "
            >
            Press <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20">Esc</kbd> to exit
        </div>

        {/* ====================================================== */}
        {/* ================= FULLSCREEN PREVIOUS ================= */}
        {/* ====================================================== */}

        <button

        type="button"

        onClick={handlePrevious}

        disabled={selectedImage === 0}

        className="
            absolute

            left-6

            top-1/2

            -translate-y-1/2

            z-20

            w-14

            h-14

            rounded-full

            bg-white/20

            backdrop-blur-md

            border

            border-white/20

            flex

            items-center

            justify-center

            text-white

            hover:bg-white/30

            transition-all

            duration-200

            disabled:opacity-30

            disabled:cursor-not-allowed
        "

        >

        <ChevronLeft size={32} />

        </button>

        {/* ====================================================== */}
        {/* ================= FULLSCREEN NEXT ===================== */}
        {/* ====================================================== */}

        <button

        type="button"

        onClick={handleNext}

        disabled={

            selectedImage ===

            (property.images?.length || 0) - 1

        }

        className="
            absolute

            right-6

            top-1/2

            -translate-y-1/2

            z-20

            w-14

            h-14

            rounded-full

            bg-white/20

            backdrop-blur-md

            border

            border-white/20

            flex

            items-center

            justify-center

            text-white

            hover:bg-white/30

            transition-all

            duration-200

            disabled:opacity-30

            disabled:cursor-not-allowed
        "

        >

        <ChevronRight size={32} />

        </button>

        {/* Image */}

        <img

        src={
            property.images?.[
            selectedImage
            ]?.url
        }

        alt={property.title}

        onLoad={() =>
            setImageLoading(false)
        }

        className={`
            max-w-[95vw]
            max-h-[92vh]

            object-contain

            transition-all

            duration-300

            ease-in-out

            ${
            imageLoading
                ? "opacity-0 scale-[0.98]"
                : "opacity-100 scale-100"
            }
        `}

        />

        <div
            className="
                absolute

                bottom-8

                left-1/2

                -translate-x-1/2

                text-white

                text-lg

                font-semibold

                bg-black/40

                px-5

                py-2

                rounded-full

                backdrop-blur-md
            "
            >

            Image {selectedImage + 1} of {property.images?.length}

        </div>

    </div>

    )}

  </div>

);

}

export default PropertyImagesReview;
