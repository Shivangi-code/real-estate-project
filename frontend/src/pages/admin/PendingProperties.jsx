import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Clock3,
  CheckCircle2,
  XCircle,
  Trash2,
  MapPin,
  IndianRupee,
  Hash,
  ShieldAlert,
  Eye,
  Building2,
} from "lucide-react";

export default function PendingProperties() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // ================= FETCH ==============================
  // ======================================================

  const fetchPending =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/admin/properties/pending",
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
          "Failed to fetch pending properties"
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
      id,
      action
    ) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `http://localhost:5000/api/admin/properties/${id}/${action}`,
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

          fetchPending();

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

    fetchPending();

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

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {/* ====================================================== */}
      {/* ================= HEADER ============================= */}
      {/* ====================================================== */}

      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-slate-900 rounded-[32px] text-white p-8 shadow-xl mb-8">

        <div className="flex items-center gap-4">

          <Clock3 size={42} />

          <div>

            <h1 className="text-4xl font-bold">

              Pending Properties

            </h1>

            <p className="text-orange-100 mt-2 text-lg">

              Review and moderate new marketplace submissions

            </p>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= STATS ============================== */}
      {/* ====================================================== */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <div className="text-yellow-500">

            <ShieldAlert size={34} />

          </div>

          <p className="text-slate-500 mt-4">

            Pending Listings

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {properties.length}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <div className="text-blue-600">

            <Building2 size={34} />

          </div>

          <p className="text-slate-500 mt-4">

            Multi Image Listings

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {
              properties.filter(
                (
                  p
                ) =>
                  p.images
                    ?.length >
                  1
              ).length
            }

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <div className="text-green-600">

            <Eye size={34} />

          </div>

          <p className="text-slate-500 mt-4">

            Ready For Review

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {properties.length}

          </h2>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= LOADING ============================ */}
      {/* ====================================================== */}

      {loading ? (

        <div className="text-center text-xl font-semibold py-20">

          Loading pending properties...

        </div>

      ) : properties.length ===
        0 ? (

        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

          <h2 className="text-3xl font-bold">

            No Pending Properties

          </h2>

          <p className="text-slate-500 mt-3">

            New property submissions will appear here.

          </p>

        </div>

      ) : (

        <div className="grid lg:grid-cols-2 gap-8">

          {properties.map(
            (
              property
            ) => (

              <div
                key={
                  property._id
                }
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-200"
              >

                {/* ====================================================== */}
                {/* ================= IMAGE ============================== */}
                {/* ====================================================== */}

                <div className="relative">

                  <img
                    src={
                      property.image ||
                      "https://via.placeholder.com/800x500?text=Property"
                    }
                    alt={
                      property.title
                    }
                    className="w-full h-72 object-cover"
                  />

                  <div className="absolute top-5 left-5 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-xs font-bold">

                    PENDING REVIEW

                  </div>

                </div>

                {/* ====================================================== */}
                {/* ================= BODY =============================== */}
                {/* ====================================================== */}

                <div className="p-6">

                  {/* PROPERTY ID */}
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">

                    <Hash size={14} />

                    <span className="font-semibold tracking-widest">

                      {
                        property.propertyUniqueId
                      }

                    </span>

                  </div>

                  {/* TITLE */}
                  <h2 className="text-2xl font-bold">

                    {property.title}

                  </h2>

                  {/* LOCATION */}
                  <div className="flex items-center gap-2 text-slate-500 mt-3">

                    <MapPin size={16} />

                    {property.location}

                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-2 text-orange-600 mt-5">

                    <IndianRupee size={20} />

                    <span className="text-3xl font-bold">

                      {formatPrice(
                        property.price
                      )}

                    </span>

                  </div>

                  {/* TYPE */}
                  <div className="flex flex-wrap gap-3 mt-5">

                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">

                      {property.type}

                    </div>

                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">

                      {property.subType}

                    </div>

                  </div>

                  {/* ====================================================== */}
                  {/* ================= GALLERY ============================ */}
                  {/* ====================================================== */}

                  {property.images
                    ?.length >
                    1 && (

                    <div className="grid grid-cols-3 gap-3 mt-6">

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
                              alt="gallery"
                              className="w-full h-24 object-cover rounded-2xl border border-slate-200"
                            />
                          )
                        )}

                    </div>
                  )}

                  {/* ====================================================== */}
                  {/* ================= OWNER ============================== */}
                  {/* ====================================================== */}

                  <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200">

                    <p className="text-sm text-slate-500">

                      Submitted By

                    </p>

                    <h3 className="font-bold mt-1">

                      {
                        property
                          ?.createdBy
                          ?.name
                      }

                    </h3>

                    <p className="text-sm text-slate-500 mt-1">

                      {
                        property
                          ?.createdBy
                          ?.role
                      }

                    </p>

                  </div>

                  {/* ====================================================== */}
                  {/* ================= ACTIONS ============================ */}
                  {/* ====================================================== */}

                  <div className="grid grid-cols-3 gap-3 mt-6">

                    {/* APPROVE */}
                    <button
                      onClick={() =>
                        updateStatus(
                          property._id,
                          "approve"
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                    >

                      <CheckCircle2 size={18} />

                      Approve

                    </button>

                    {/* REJECT */}
                    <button
                      onClick={() =>
                        updateStatus(
                          property._id,
                          "reject"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                    >

                      <XCircle size={18} />

                      Reject

                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        updateStatus(
                          property._id,
                          "delete"
                        )
                      }
                      className="bg-slate-900 hover:bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                    >

                      <Trash2 size={18} />

                      Delete

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}