import { useEffect, useState } from "react";
import {
  Users,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/lead/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const badge = (status) => {
    if (status === "contacted")
      return "bg-blue-100 text-blue-700";

    if (status === "closed")
      return "bg-green-100 text-green-700";

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-8">
      {/* TOP */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold">
          Leads Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Manage incoming buyer inquiries.
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <Users className="text-slate-700 mb-3" />
          <p className="text-slate-500">
            Total Leads
          </p>
          <h2 className="text-3xl font-bold">
            {leads.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">
            New Leads
          </p>
          <h2 className="text-3xl font-bold text-yellow-600">
            {
              leads.filter(
                (x) => x.status === "new"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">
            Closed Leads
          </p>
          <h2 className="text-3xl font-bold text-green-600">
            {
              leads.filter(
                (x) =>
                  x.status === "closed"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            All Leads
          </h2>
        </div>

        {loading ? (
          <p className="p-6">Loading...</p>
        ) : leads.length === 0 ? (
          <p className="p-6">
            No leads found.
          </p>
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
                    Message
                  </th>
                  <th className="p-4 text-left">
                    Status
                  </th>
                  <th className="p-4 text-left">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-t"
                  >
                    <td className="p-4 font-medium">
                      {lead.buyerName}
                    </td>

                    <td className="p-4 space-y-1">
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

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} />
                        {
                          lead.propertyTitle
                        }
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      {lead.message ||
                        "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${badge(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(
                        lead.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}