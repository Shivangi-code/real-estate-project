import { useState } from "react";
import { propertyTypes } from "../data/propertyTypes";

const PropertyFilter = ({ type, subType }) => {

  const [config, setConfig] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");

  const inputStyle =
    "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none px-4 py-2 rounded-xl transition duration-200";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-wrap gap-4 items-center justify-center max-w-5xl mx-auto mt-8">

      {/* SHOW SELECTED TYPE */}
      {type && (
        <div className="font-semibold text-gray-700">
          Selected: {type} → {subType}
        </div>
      )}

      {/* CONFIGURATION */}
      {type && subType && propertyTypes[type]?.[subType] && (
        <select value={config} onChange={(e) => setConfig(e.target.value)} className={inputStyle}>
          <option value="">Select Configuration</option>
          {propertyTypes[type][subType].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      {/* AREA */}
      {config && (
        <input
          type="text"
          placeholder="Area (sq ft)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className={inputStyle}
        />
      )}

      {/* PRICE */}
      {config && (
        <input
          type="text"
          placeholder="Price Range"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputStyle}
        />
      )}

      {/* SEARCH BUTTON */}
      {config && (
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-200 shadow">
          Search
        </button>
      )}

    </div>
  );
};

export default PropertyFilter;