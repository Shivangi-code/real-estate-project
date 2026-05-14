import { Link } from "react-router-dom";
import "./SellerDashboard.css";

import {
  Building2,
  PlusCircle,
  Clock3,
  ArrowRight,
} from "lucide-react";

const SellerDashboard = () => {

  return (

    <div className="min-h-screen bg-slate-100 p-6 md:p-10">

      {/* HERO */}
      <div
        className="hero-section relative overflow-hidden rounded-[32px] p-10 md:p-14 text-white mb-10"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(15,23,42,0.82),
              rgba(30,41,59,0.72)
            ),
            url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1974&auto=format&fit=crop")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* GLOW EFFECTS */}
        <div className="hero-glow blue" />
        <div className="hero-glow cyan" />

        {/* CONTENT */}
        <div className="relative z-10">

          <p className="uppercase tracking-[5px] text-blue-200 text-sm font-semibold mb-4">
            Seller Dashboard
          </p>

          <h1 className="dashboard-title text-4xl md:text-6xl font-black leading-tight">
            Manage Your
            <span className="block text-blue-300">
              Property Listings
            </span>
          </h1>

          <p className="mt-6 text-slate-200 text-lg max-w-2xl leading-8">
            Add, manage and track all your listed properties
            from one modern dashboard experience.
          </p>

        </div>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* ADD PROPERTY */}
        <div className="dashboard-card bg-white rounded-[28px] p-7 shadow-lg border border-slate-200">

          <div className="icon-box w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">

            <PlusCircle
              size={28}
              className="text-blue-600"
            />

          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Add Property
          </h2>

          <p className="text-slate-500 mt-3 leading-7">
            List your residential, commercial or agricultural
            property for buyers.
          </p>

          <Link
            to="/add-property"
            className="dashboard-btn inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Add Property
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* MY PROPERTIES */}
        <div className="dashboard-card bg-white rounded-[28px] p-7 shadow-lg border border-slate-200">

          <div className="icon-box w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">

            <Building2
              size={28}
              className="text-purple-600"
            />

          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            My Properties
          </h2>

          <p className="text-slate-500 mt-3 leading-7">
            View, edit and manage all your active property
            listings in one place.
          </p>

          <Link
            to="/seller/properties"
            className="dashboard-btn inline-flex items-center gap-2 mt-6 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            View Listings
            <ArrowRight size={18} />
          </Link>

        </div>

        {/* PENDING */}
        <div className="dashboard-card bg-white rounded-[28px] p-7 shadow-lg border border-slate-200">

          <div className="icon-box w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">

            <Clock3
              size={28}
              className="text-green-600"
            />

          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Pending Approval
          </h2>

          <p className="text-slate-500 mt-3 leading-7">
            Track listings waiting for admin approval and
            verification.
          </p>

          <Link
            to="/seller/properties"
            className="dashboard-btn inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Check Status
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default SellerDashboard;