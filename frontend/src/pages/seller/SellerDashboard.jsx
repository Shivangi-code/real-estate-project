import { Link } from "react-router-dom";

const SellerDashboard = () => {
  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Add Property</h2>
          <p className="text-gray-500 mt-2">List your property for buyers</p>
          <Link
            to="/add-property"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Property
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">My Properties</h2>
          <p className="text-gray-500 mt-2">Manage your listings</p>
          <Link
            to="/seller/properties"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            View
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Pending Approval</h2>
          <p className="text-gray-500 mt-2">Properties awaiting admin approval</p>
          <Link
            to="/seller/properties"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Check
          </Link>
        </div>

      </div>

    </div>
  );
};

export default SellerDashboard;