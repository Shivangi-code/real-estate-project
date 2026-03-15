import { Link, Outlet } from "react-router-dom";
import { FaHome, FaBuilding, FaPlus, FaUser } from "react-icons/fa";

const DashboardLayout = ({ role }) => {
  const menus = {
    admin: [
      { name: "Overview", path: "/admin", icon: <FaHome /> },
      { name: "Pending Properties", path: "/admin/properties/pending", icon: <FaBuilding /> },
      { name: "Approved Properties", path: "/admin/properties/approved", icon: <FaBuilding /> },
    ],

    seller: [
      { name: "Dashboard", path: "/seller", icon: <FaHome /> },
      { name: "Add Property", path: "/add-property", icon: <FaPlus /> },
      { name: "My Properties", path: "/seller/properties", icon: <FaBuilding /> },
      { name: "Profile", path: "/seller/profile", icon: <FaUser /> },
    ],

    agent: [
      { name: "Dashboard", path: "/agent", icon: <FaHome /> },
      { name: "Add Listing", path: "/add-property", icon: <FaPlus /> },
      { name: "My Listings", path: "/agent/properties", icon: <FaBuilding /> },
      { name: "Profile", path: "/agent/profile", icon: <FaUser /> },
    ],

    builder: [
      { name: "Dashboard", path: "/builder", icon: <FaHome /> },
      { name: "Add Project", path: "/add-property", icon: <FaPlus /> },
      { name: "My Projects", path: "/builder/properties", icon: <FaBuilding /> },
      { name: "Profile", path: "/builder/profile", icon: <FaUser /> },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-10 capitalize">{role} Panel</h2>

        <nav className="space-y-4">
          {menus[role].map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition"
            >
              {menu.icon}
              {menu.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-semibold text-lg capitalize">{role} Dashboard</h1>

          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;