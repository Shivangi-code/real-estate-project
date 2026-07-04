import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Building2,
  Search,
  Filter,
  Trash2,
  Eye,
  Pencil,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock3,
  IndianRupee,
  MapPin,
  PlusCircle,
  ShieldCheck,
  RefreshCcw,
  LayoutGrid,
  List,
  ArrowUpRight,
} from "lucide-react";

import toast from "react-hot-toast";

import socket from "../../socket";

// ======================================================
// ================= ADMIN PROPERTIES ===================
// ======================================================

export default function AdminProperties() {
  // ======================================================
  // ================= ROUTER =============================
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [properties, setProperties] = useState([]);

  const [filteredProperties, setFilteredProperties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [viewMode, setViewMode] = useState("grid");
  const [actionLoading, setActionLoading] = useState(null);
  // ======================================================
  // ================= USER ===============================
  // ======================================================

  const user = JSON.parse(localStorage.getItem("user"));

  // ======================================================
  // ================= FETCH ==============================
  // ======================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/my-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const propertiesData = data?.properties || data?.data || data || [];

      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
    } catch (error) {
      console.log("ADMIN PROPERTY FETCH ERROR:", error);

      toast.error("Failed to load properties");
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  };

  // ======================================================
  // ================= INITIAL LOAD =======================
  // ======================================================

  useEffect(() => {
    fetchProperties();
  }, []);

  // ======================================================
  // ================= REALTIME ===========================
  // ======================================================

  useEffect(() => {
    socket.on("propertyUpdated", fetchProperties);

    socket.on("propertyDeleted", fetchProperties);

    socket.on("propertyApproved", fetchProperties);

    socket.on("propertyRejected", fetchProperties);

    socket.on("propertyRestored", fetchProperties);

    return () => {
      socket.off("propertyUpdated", fetchProperties);

      socket.off("propertyDeleted", fetchProperties);

      socket.off("propertyApproved", fetchProperties);

      socket.off("propertyRejected", fetchProperties);

      socket.off("propertyRestored", fetchProperties);
    };
  }, []);

  // ======================================================
  // ================= FILTER =============================
  // ======================================================

  useEffect(() => {
    let updated = [...properties];

    // ================= SEARCH =================

    if (search.trim()) {
      const lower = search.toLowerCase();

      updated = updated.filter(
        (property) =>
          property?.title?.toLowerCase()?.includes(lower) ||
          property?.location?.toLowerCase()?.includes(lower) ||
          property?.propertyUniqueId?.toLowerCase()?.includes(lower),
      );
    }

    // ================= STATUS =================

    if (statusFilter !== "all") {
      updated = updated.filter((property) => property?.status === statusFilter);
    }

    setFilteredProperties(updated);
  }, [properties, search, statusFilter]);

  // ======================================================
  // ================= COUNTERS ===========================
  // ======================================================

  const analytics = useMemo(() => {
    return {
      total: properties.length,

      approved: properties.filter((p) => p.status === "approved").length,

      pending: properties.filter((p) => p.status === "pending").length,

      rejected: properties.filter((p) => p.status === "rejected").length,
    };
  }, [properties]);

  // ======================================================
  // ================= FORMAT PRICE =======================
  // ======================================================

  const formatPrice = (price) => {
    if (!price) return "N/A";

    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    }

    if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(1)} L`;
    }

    return `₹ ${price}`;
  };

  // ======================================================
  // ================= STATUS COLOR =======================
  // ======================================================

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return `
            bg-green-100
            text-green-700
          `;

      case "rejected":
        return `
            bg-red-100
            text-red-700
          `;

      case "deleted":
        return `
            bg-red-200
            text-red-800
          `;

      default:
        return `
            bg-yellow-100
            text-yellow-700
          `;
    }
  };

  // ======================================================
  // ================= DELETE PROPERTY ====================
  // ======================================================

  const handleDelete = async (propertyId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this property?",
      );

      if (!confirmed) return;

      setActionLoading(propertyId);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties/delete/${propertyId}`,

        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Delete failed");
      }

      toast.success("Property deleted successfully");

      fetchProperties();
    } catch (error) {
      console.log("DELETE PROPERTY ERROR:", error);

      toast.error(error.message || "Failed to delete property");
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // ================= RESTORE PROPERTY ===================
  // ======================================================

  const handleRestore = async (propertyId) => {
    try {
      const confirmed = window.confirm("Restore this property?");

      if (!confirmed) return;

      setActionLoading(propertyId);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/properties/restore/${propertyId}`,

        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Restore failed");
      }

      toast.success("Property restored successfully");

      fetchProperties();
    } catch (error) {
      console.log("RESTORE PROPERTY ERROR:", error);

      toast.error(error.message || "Failed to restore property");
    } finally {
      setActionLoading(null);
    }
  };

  // ======================================================
  // ================= LOADING ============================
  // ======================================================

  if (loading) {
    return (
      <div
        className="
        min-h-screen

        flex
        items-center
        justify-center

        bg-slate-100
      "
      >
        <div
          className="
          text-center
        "
        >
          <div
            className="
            w-16
            h-16

            border-4
            border-blue-600
            border-t-transparent

            rounded-full

            animate-spin

            mx-auto
            mb-5
          "
          />

          <h2
            className="
            text-2xl
            font-bold
            text-slate-800
          "
          >
            Loading Properties...
          </h2>
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
      lg:p-8
    "
    >
      {/* ====================================================== */}
      {/* ================= HERO =============================== */}
      {/* ====================================================== */}

      <div
        className="
        relative

        overflow-hidden

        rounded-[28px]

        bg-gradient-to-br
        from-slate-900
        via-blue-950
        to-indigo-950

        p-6
        sm:p-8
        lg:p-10

        shadow-2xl

        mb-8
      "
      >
        <div
          className="
          absolute
          inset-0

          opacity-10
        "
        >
          <div
            className="
            absolute
            -top-16
            -right-16

            w-72
            h-72

            rounded-full

            bg-blue-500
            blur-3xl
          "
          />
        </div>

        <div
          className="
          relative
          z-10

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
              inline-flex
              items-center
              gap-2

              bg-white/10

              border
              border-white/10

              rounded-full

              px-4
              py-2

              text-white

              text-sm
              font-semibold

              mb-5
            "
            >
              <ShieldCheck size={16} />
              Admin Inventory Control
            </div>

            <h1
              className="
              text-3xl
              sm:text-4xl
              lg:text-5xl

              font-black

              text-white

              leading-tight
            "
            >
              Admin Properties
            </h1>

            <p
              className="
              text-slate-300

              mt-4

              text-base
              sm:text-lg

              max-w-2xl
            "
            >
              Monitor, manage and track all properties added by admin with
              realtime moderation visibility.
            </p>
          </div>

          {/* RIGHT */}

          <div
            className="
            flex
            flex-wrap

            gap-4
          "
          >
            <button
              onClick={() => navigate("/add-property")}
              className="
                bg-white

                text-slate-900

                px-5
                sm:px-7

                py-3.5
                sm:py-4

                rounded-2xl

                font-semibold

                hover:scale-105

                transition-all
                duration-300

                shadow-xl

                flex
                items-center
                gap-3
              "
            >
              <PlusCircle size={20} />
              Add Property
              <ArrowUpRight size={18} />
            </button>

            <button
              onClick={() => {
                setRefreshing(true);

                fetchProperties();
              }}
              className="
                bg-blue-500/20

                border
                border-blue-300/20

                text-white

                px-5
                sm:px-7

                py-3.5
                sm:py-4

                rounded-2xl

                font-semibold

                hover:bg-blue-500/30

                transition-all
                duration-300

                backdrop-blur-xl

                flex
                items-center
                gap-3
              "
            >
              <RefreshCcw
                size={20}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ================= ANALYTICS ========================== */}
      {/* ====================================================== */}

      <div
        className="
        grid

        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4

        gap-5

        mb-8
      "
      >
        {[
          {
            label: "Total",
            value: analytics.total,
            icon: Building2,
            color: "bg-blue-600",
          },

          {
            label: "Approved",
            value: analytics.approved,
            icon: CheckCircle2,
            color: "bg-green-600",
          },

          {
            label: "Pending",
            value: analytics.pending,
            icon: Clock3,
            color: "bg-yellow-500",
          },

          {
            label: "Rejected",
            value: analytics.rejected,
            icon: XCircle,
            color: "bg-red-600",
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                bg-white

                rounded-[24px]

                p-6

                shadow-sm

                border
                border-slate-200
              "
            >
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <div>
                  <p
                    className="
                    text-slate-500
                    text-sm
                    font-medium
                  "
                  >
                    {item.label}
                  </p>

                  <h2
                    className="
                    text-4xl
                    font-black
                    text-slate-900

                    mt-2
                  "
                  >
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`
                  ${item.color}

                  w-14
                  h-14

                  rounded-2xl

                  flex
                  items-center
                  justify-center

                  text-white
                `}
                >
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================== */}
      {/* ================= CONTROLS =========================== */}
      {/* ====================================================== */}

      <div
        className="
        bg-white

        rounded-[28px]

        p-5
        sm:p-6

        shadow-sm

        border
        border-slate-200

        mb-8
      "
      >
        <div
          className="
          flex
          flex-col
          xl:flex-row

          xl:items-center
          xl:justify-between

          gap-5
        "
        >
          {/* SEARCH */}

          <div
            className="
            relative

            flex-1
          "
          >
            <Search
              size={20}
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
                Search by title,
                location or property ID...
              "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full

                bg-slate-50

                border
                border-slate-200

                rounded-2xl

                pl-12
                pr-5

                py-4

                outline-none

                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* RIGHT */}

          <div
            className="
            flex
            flex-wrap

            gap-4
          "
          >
            {/* FILTER */}

            <div
              className="
              relative
            "
            >
              <Filter
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-slate-400
                "
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="
                  appearance-none

                  bg-slate-50

                  border
                  border-slate-200

                  rounded-2xl

                  pl-11
                  pr-10

                  py-4

                  outline-none

                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <option value="all">All Status</option>

                <option value="approved">Approved</option>

                <option value="pending">Pending</option>

                <option value="rejected">Rejected</option>

                <option value="deleted">Deleted</option>
              </select>
            </div>

            {/* VIEW MODE */}

            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="
                bg-slate-100

                border
                border-slate-200

                px-5

                rounded-2xl

                hover:bg-slate-200

                transition

                flex
                items-center
                justify-center
              "
            >
              {viewMode === "grid" ? (
                <List size={20} />
              ) : (
                <LayoutGrid size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ================= EMPTY STATE ======================== */}
      {/* ====================================================== */}

      {filteredProperties.length === 0 && (
        <div
          className="
          bg-white

          rounded-[32px]

          border
          border-slate-200

          shadow-sm

          p-10
          sm:p-16

          text-center
        "
        >
          <div
            className="
            w-24
            h-24

            rounded-full

            bg-blue-100

            flex
            items-center
            justify-center

            mx-auto

            mb-6
          "
          >
            <Building2
              size={42}
              className="
                text-blue-700
              "
            />
          </div>

          <h2
            className="
            text-3xl
            font-black
            text-slate-900
          "
          >
            No Properties Found
          </h2>

          <p
            className="
            text-slate-500

            mt-4

            max-w-xl

            mx-auto
          "
          >
            No admin properties match the current filters or inventory is empty.
          </p>

          <button
            onClick={() => navigate("/add-property")}
            className="
              mt-8

              bg-blue-600
              hover:bg-blue-700

              text-white

              px-8
              py-4

              rounded-2xl

              font-bold

              transition-all

              inline-flex
              items-center
              gap-3
            "
          >
            <PlusCircle size={20} />
            Add New Property
          </button>
        </div>
      )}

      {/* ====================================================== */}
      {/* ================= PROPERTY GRID ====================== */}
      {/* ====================================================== */}

      {filteredProperties.length > 0 && (
        <div
          className={`
          ${
            viewMode === "grid"
              ? `
                grid

                grid-cols-1
                md:grid-cols-2
                2xl:grid-cols-3
              `
              : `
                flex
                flex-col
              `
          }

          gap-6
        `}
        >
          {filteredProperties.map((property) => {
            const image =
              property?.images?.[0]?.url ||
              property?.image ||
              "/default-property.jpg";

            return (
              <div
                key={property._id}
                className={`
                    bg-white

                    rounded-[30px]

                    overflow-hidden

                    shadow-sm
                    hover:shadow-xl

                    transition-all
                    duration-300

                    border

                    ${
                      property?.status === "deleted"
                        ? `
                          border-red-300
                          opacity-80
                        `
                        : `
                          border-slate-200
                        `
                    }
                  `}
              >
                {/* IMAGE */}

                <div
                  className="
                    relative
                  "
                >
                  <img
                    src={image}
                    alt={property?.title}
                    className="
                        w-full

                        h-[240px]

                        object-cover
                      "
                    onError={(e) => {
                      e.target.onerror = null;

                      e.target.src = "/default-property.jpg";
                    }}
                  />

                  {/* STATUS */}

                  <div
                    className={`
                      absolute
                      top-5
                      left-5

                      px-4
                      py-2

                      rounded-full

                      text-sm
                      font-bold

                      capitalize

                      ${getStatusStyles(property?.status)}
                    `}
                  >
                    {property?.status || "pending"}
                  </div>
                </div>

                {/* CONTENT */}

                <div
                  className="
                    p-6
                  "
                >
                  {/* TITLE */}

                  <h2
                    className="
                      text-2xl

                      font-black

                      text-slate-900

                      line-clamp-1
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
                    <MapPin size={17} />

                    <span
                      className="
                        line-clamp-1
                      "
                    >
                      {property?.location || "N/A"}
                    </span>
                  </div>

                  {/* PRICE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2

                      mt-5

                      text-blue-700
                    "
                  >
                    <IndianRupee size={22} />

                    <span
                      className="
                        text-2xl

                        font-black
                      "
                    >
                      {formatPrice(property?.price)}
                    </span>
                  </div>

                  {/* INFO */}

                  <div
                    className="
                      flex
                      flex-wrap

                      gap-3

                      mt-5
                    "
                  >
                    {property?.type && (
                      <div
                        className="
                          bg-blue-100

                          text-blue-700

                          px-4
                          py-2

                          rounded-full

                          text-sm
                          font-semibold
                        "
                      >
                        {property.type}
                      </div>
                    )}

                    {property?.subType && (
                      <div
                        className="
                          bg-indigo-100

                          text-indigo-700

                          px-4
                          py-2

                          rounded-full

                          text-sm
                          font-semibold
                        "
                      >
                        {property.subType}
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div
                    className="
                      mt-7

                      flex
                      flex-wrap

                      gap-3
                    "
                  >
                    {/* VIEW */}

                    <button
                      onClick={() => navigate(`/properties/${property._id}`)}
                      className="
                          flex-1

                          min-w-[140px]

                          bg-blue-600
                          hover:bg-blue-700

                          text-white

                          py-3.5

                          rounded-2xl

                          font-bold

                          transition

                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                    >
                      <Eye size={18} />
                      View
                    </button>

                    {/* EDIT */}

                    {property?.status !== "deleted" && (
                      <button
                        onClick={() =>
                          navigate(`/edit-property/${property._id}`)
                        }
                        className="
                            bg-indigo-100
                            hover:bg-indigo-200

                            text-indigo-700

                            px-5

                            rounded-2xl

                            transition

                            flex
                            items-center
                            justify-center
                          "
                      >
                        <Pencil size={18} />
                      </button>
                    )}

                    {/* DELETE */}

                    {property?.status !== "deleted" && (
                      <button
                        onClick={() => handleDelete(property._id)}
                        disabled={actionLoading === property._id}
                        className="
                            bg-red-100
                            hover:bg-red-200

                            text-red-700

                            px-5

                            rounded-2xl

                            transition

                            disabled:opacity-50

                            flex
                            items-center
                            justify-center
                          "
                      >
                        {actionLoading === property._id ? (
                          <Loader2
                            size={18}
                            className="
                                    animate-spin
                                  "
                          />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    )}

                    {/* RESTORE */}

                    {property?.status === "deleted" && (
                      <button
                        onClick={() => handleRestore(property._id)}
                        disabled={actionLoading === property._id}
                        className="
                            bg-green-100
                            hover:bg-green-200

                            text-green-700

                            px-5

                            rounded-2xl

                            transition

                            disabled:opacity-50

                            flex
                            items-center
                            justify-center
                          "
                      >
                        {actionLoading === property._id ? (
                          <Loader2
                            size={18}
                            className="
                                    animate-spin
                                  "
                          />
                        ) : (
                          <RotateCcw size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
