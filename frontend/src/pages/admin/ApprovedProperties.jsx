import {
  useEffect,
  useState,
} from "react";

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
} from "lucide-react";

export default function ApprovedProperties() {

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // ================= FETCH ==============================
  // ======================================================

  const fetchApproved =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/admin/properties/approved",
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
          "Failed to fetch approved properties"
        );

      } finally {

        setLoading(false);
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
  // ================= STATUS =============================
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
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-bold">

            SOLD

          </div>
        );
      }

      if (
        underNegotiation
      ) {

        return (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-xs font-bold">

            UNDER NEGOTIATION

          </div>
        );
      }

      return (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold">

          AVAILABLE

        </div>
      );
    };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {/* ====================================================== */}
      {/* ================= HEADER ============================= */}
      {/* ====================================================== */}

      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-slate-900 rounded-[32px] text-white p-8 shadow-xl mb-8">

        <div className="flex items-center gap-4">

          <CheckCircle2 size={42} />

          <div>

            <h1 className="text-4xl font-bold">

              Approved Properties

            </h1>

            <p className="text-green-100 mt-2 text-lg">

              Monitor verified and approved marketplace listings

            </p>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ================= STATS ============================== */}
      {/* ====================================================== */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <div className="text-green-600">

            <Building2 size={34} />

          </div>

          <p className="text-slate-500 mt-4">

            Total Approved

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {properties.length}

          </h2>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <div className="text-yellow-500">

            <BadgeCheck size={34} />

          </div>

          <p className="text-slate-500 mt-4">

            Under Negotiation

          </p>

          <h2 className="text-4xl font-bold mt-2">

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

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <div className="text-red-600">

            <ShieldCheck size={34} />

          </div>

          <p className="text-slate-500 mt-4">

            Sold Properties

          </p>

          <h2 className="text-4xl font-bold mt-2">

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

      </div>

      {/* ====================================================== */}
      {/* ================= LOADING ============================ */}
      {/* ====================================================== */}

      {loading ? (

        <div className="text-center text-xl font-semibold py-20">

          Loading approved properties...

        </div>

      ) : properties.length ===
        0 ? (

        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

          <h2 className="text-3xl font-bold">

            No Approved Properties

          </h2>

          <p className="text-slate-500 mt-3">

            Approved listings will appear here.

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
                {/* ================= MAIN IMAGE ========================= */}
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

                  <div className="absolute top-5 left-5">

                    {getBusinessBadge(
                      property.businessStatus,
                      property.underNegotiation
                    )}

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
                  <div className="flex items-center gap-2 text-green-700 mt-5">

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
                  {/* ================= FOOTER ============================= */}
                  {/* ====================================================== */}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">

                    <div className="text-sm text-slate-500">

                      Uploaded by{" "}

                      <span className="font-semibold">

                        {
                          property
                            ?.createdBy
                            ?.name
                        }

                      </span>

                    </div>

                    <button
                      onClick={() =>
                        window.open(
                          `/property/${property._id}`,
                          "_blank"
                        )
                      }
                      className="bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition"
                    >

                      <Eye size={18} />

                      View

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