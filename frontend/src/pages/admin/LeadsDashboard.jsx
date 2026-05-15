import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  Phone,
  Mail,
  Building2,
  Hash,
  MessageSquare,
  CheckCircle,
  Clock3,
  AlertTriangle,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";

import socket from "../../socket";

export default function LeadsDashboard() {

  const [leads, setLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("all");

  // ================= FETCH =================
  const fetchLeads =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/leads/all",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setLeads(
          Array.isArray(data)
            ? data
            : []
        );

      } catch {

        setLeads([]);

      } finally {

        setLoading(false);
      }
    };

  // ================= REALTIME =================
  useEffect(() => {

    fetchLeads();

    socket.on(
      "leadUpdated",
      () => {
        fetchLeads();
      }
    );

    return () => {

      socket.off(
        "leadUpdated"
      );
    };

  }, []);

  // ================= UPDATE STATUS =================
  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await fetch(
          `http://localhost:5000/api/leads/${id}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      } catch (err) {

        console.log(err);
      }
    };

  // ================= BADGE =================
  const badge = (
    status
  ) => {

    if (
      status ===
      "new"
    ) {

      return "bg-yellow-100 text-yellow-700";
    }

    if (
      status ===
      "in-progress"
    ) {

      return "bg-blue-100 text-blue-700";
    }

    if (
      status ===
      "contacted"
    ) {

      return "bg-purple-100 text-purple-700";
    }

    if (
      status ===
      "closed"
    ) {

      return "bg-green-100 text-green-700";
    }

    return "bg-red-100 text-red-700";
  };

  // ================= FILTERED =================
  const filteredLeads =
    filter === "all"
      ? leads
      : leads.filter(
          (lead) =>
            lead.leadType ===
            filter
        );

  // ================= COUNTS =================
  const inquiryLeads =
    leads.filter(
      (x) =>
        x.leadType ===
        "property-inquiry"
    );

  const contactLeads =
    leads.filter(
      (x) =>
        x.leadType ===
        "contact-us"
    );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <p className="uppercase tracking-widest text-sm text-slate-500">
              CRM Dashboard
            </p>

            <h1 className="text-4xl font-bold mt-2">
              Leads Management
            </h1>

            <p className="text-slate-500 mt-3">
              Manage inquiry leads,
              contact leads and realtime CRM workflow.
            </p>

          </div>

          {/* LIVE */}
          <div className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl flex items-center gap-3 font-semibold">

            <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />

            Live CRM Active

          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

        {/* TOTAL */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <Users className="text-slate-700 mb-4" />

          <p className="text-slate-500">
            Total Leads
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {leads.length}
          </h2>

        </div>

        {/* INQUIRY */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <Building2 className="text-blue-600 mb-4" />

          <p className="text-slate-500">
            Inquiry Leads
          </p>

          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {inquiryLeads.length}
          </h2>

        </div>

        {/* CONTACT */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <MessageSquare className="text-purple-600 mb-4" />

          <p className="text-slate-500">
            Contact Leads
          </p>

          <h2 className="text-4xl font-bold mt-2 text-purple-600">
            {contactLeads.length}
          </h2>

        </div>

        {/* IN PROGRESS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <Clock3 className="text-yellow-600 mb-4" />

          <p className="text-slate-500">
            In Progress
          </p>

          <h2 className="text-4xl font-bold mt-2 text-yellow-600">

            {
              leads.filter(
                (x) =>
                  x.status ===
                  "in-progress"
              ).length
            }

          </h2>

        </div>

        {/* CLOSED */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <CheckCircle className="text-green-600 mb-4" />

          <p className="text-slate-500">
            Closed Leads
          </p>

          <h2 className="text-4xl font-bold mt-2 text-green-600">

            {
              leads.filter(
                (x) =>
                  x.status ===
                  "closed"
              ).length
            }

          </h2>

        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">

        <button
          onClick={() =>
            setFilter("all")
          }
          className={`px-5 py-3 rounded-2xl font-medium transition ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "bg-white"
          }`}
        >

          All Leads

        </button>

        <button
          onClick={() =>
            setFilter(
              "property-inquiry"
            )
          }
          className={`px-5 py-3 rounded-2xl font-medium transition ${
            filter ===
            "property-inquiry"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >

          Inquiry Leads

        </button>

        <button
          onClick={() =>
            setFilter(
              "contact-us"
            )
          }
          className={`px-5 py-3 rounded-2xl font-medium transition ${
            filter ===
            "contact-us"
              ? "bg-purple-600 text-white"
              : "bg-white"
          }`}
        >

          Contact Leads

        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        <div className="p-6 border-b flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold">
              CRM Leads
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Realtime inquiry management system
            </p>

          </div>

          <button
            onClick={
              fetchLeads
            }
            className="bg-slate-100 hover:bg-slate-200 p-3 rounded-2xl transition"
          >

            <RefreshCcw size={18} />

          </button>
        </div>

        {loading ? (

          <div className="p-10 text-center">
            Loading leads...
          </div>

        ) : filteredLeads.length ===
          0 ? (

          <div className="p-10 text-center">

            <AlertTriangle className="mx-auto mb-4 text-slate-400" size={40} />

            <h3 className="text-2xl font-bold">
              No Leads Found
            </h3>

            <p className="text-slate-500 mt-2">
              Leads will appear here automatically.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50">

                <tr>

                  <th className="p-4 text-left">
                    Buyer
                  </th>

                  <th className="p-4 text-left">
                    Contact
                  </th>

                  <th className="p-4 text-left">
                    Property
                  </th>

                  <th className="p-4 text-left">
                    Type
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                  <th className="p-4 text-left">
                    Time
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredLeads.map(
                  (lead) => (

                    <tr
                      key={
                        lead._id
                      }
                      className="border-t hover:bg-slate-50 transition"
                    >

                      {/* BUYER */}
                      <td className="p-4">

                        <div className="font-semibold">
                          {lead.buyerName}
                        </div>

                        <div className="text-slate-500 text-xs mt-1">

                          {lead.buyerCity ||
                            "N/A"}

                        </div>

                      </td>

                      {/* CONTACT */}
                      <td className="p-4 space-y-2">

                        <div className="flex items-center gap-2">

                          <Phone size={14} />

                          {lead.buyerMobile}

                        </div>

                        <div className="flex items-center gap-2 text-slate-500">

                          <Mail size={14} />

                          {lead.buyerEmail ||
                            "-"}

                        </div>

                      </td>

                      {/* PROPERTY */}
                      <td className="p-4">

                        <div className="font-semibold">

                          {lead.propertyTitle ||
                            "Contact Lead"}

                        </div>

                        {lead.propertyUniqueId && (

                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">

                            <Hash size={12} />

                            {
                              lead.propertyUniqueId
                            }

                          </div>
                        )}

                      </td>

                      {/* TYPE */}
                      <td className="p-4">

                        <div className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          lead.leadType ===
                          "contact-us"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>

                          {lead.leadType ===
                          "contact-us"
                            ? "Contact"
                            : "Inquiry"}

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="p-4">

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge(
                          lead.status
                        )}`}>

                          {lead.status}

                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">

                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() =>
                              updateStatus(
                                lead._id,
                                "in-progress"
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded-xl text-xs"
                          >

                            Progress

                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                lead._id,
                                "contacted"
                              )
                            }
                            className="bg-purple-600 text-white px-3 py-1 rounded-xl text-xs"
                          >

                            Contacted

                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                lead._id,
                                "closed"
                              )
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded-xl text-xs"
                          >

                            Close

                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                lead._id,
                                "spam"
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded-xl text-xs"
                          >

                            Spam

                          </button>

                        </div>

                      </td>

                      {/* TIME */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">

                        {new Date(
                          lead.createdAt
                        ).toLocaleString()}

                      </td>
                    </tr>
                  )
                )}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}