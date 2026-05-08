import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, Clock3, XCircle } from "lucide-react";

export default function DeletedProperties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => { fetchDeleted(); }, []);

  const fetchDeleted = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/properties/deleted", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProperties(await res.json());
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/admin/property/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    toast.success(`Restored to ${status}`);
    fetchDeleted();
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Deleted Properties</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((item) => (
          <div key={item._id} className="bg-white p-5 rounded-3xl shadow">
            <h2>{item.title}</h2>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <button onClick={() => updateStatus(item._id, "pending")} className="bg-yellow-500 text-white p-2 rounded">
                <Clock3 size={16} />
                Pending
              </button>

              <button onClick={() => updateStatus(item._id, "approved")} className="bg-green-600 text-white p-2 rounded">
                <CheckCircle size={16} />
                Approved
              </button>

              <button onClick={() => updateStatus(item._id, "rejected")} className="bg-red-600 text-white p-2 rounded">
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}