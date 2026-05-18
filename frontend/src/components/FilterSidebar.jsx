import {
  useState,
} from "react";

import {
  Filter,
  IndianRupee,
  Building2,
  BadgeCheck,
} from "lucide-react";

function FilterSidebar({
  filters,
  setFilters,
}) {

  const [
    openSection,
    setOpenSection,
  ] = useState(
    "type"
  );

  const toggleSection =
    (section) => {

      setOpenSection(
        openSection ===
          section
          ? ""
          : section
      );
    };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-6 sticky top-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="bg-blue-100 p-3 rounded-2xl">

          <Filter className="text-blue-700" />

        </div>

        <div>

          <h2 className="text-2xl font-bold">

            Filters

          </h2>

          <p className="text-slate-500 text-sm">

            Advanced property search

          </p>

        </div>

      </div>

      {/* TYPE */}
      <div className="mb-6">

        <button
          onClick={() =>
            toggleSection(
              "type"
            )
          }
          className="font-bold text-lg mb-4 flex items-center gap-2"
        >

          <Building2 size={18} />

          Property Type

        </button>

        {openSection ===
          "type" && (

          <div className="space-y-3">

            {[
              "Residential",
              "Commercial",
              "Agriculture",
            ].map(
              (
                item
              ) => (

                <button
                  key={
                    item
                  }
                  onClick={() =>
                    setFilters({
                      ...filters,
                      type:
                        filters.type ===
                        item
                          ? ""
                          : item,
                    })
                  }
                  className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                    filters.type ===
                    item
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >

                  {item}

                </button>
              )
            )}

          </div>
        )}

      </div>

      {/* PRICE */}
      <div className="mb-6">

        <button
          onClick={() =>
            toggleSection(
              "price"
            )
          }
          className="font-bold text-lg mb-4 flex items-center gap-2"
        >

          <IndianRupee size={18} />

          Budget

        </button>

        {openSection ===
          "price" && (

          <div className="space-y-4">

            <input
              type="number"
              placeholder="Minimum Price"
              value={
                filters.minPrice
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minPrice:
                    e.target
                      .value,
                })
              }
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
            />

            <input
              type="number"
              placeholder="Maximum Price"
              value={
                filters.maxPrice
              }
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice:
                    e.target
                      .value,
                })
              }
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
            />

          </div>
        )}

      </div>

      {/* STATUS */}
      <div className="mb-6">

        <button
          onClick={() =>
            toggleSection(
              "status"
            )
          }
          className="font-bold text-lg mb-4 flex items-center gap-2"
        >

          <BadgeCheck size={18} />

          Business Status

        </button>

        {openSection ===
          "status" && (

          <div className="space-y-3">

            {[
              "available",
              "sold",
            ].map(
              (
                item
              ) => (

                <button
                  key={
                    item
                  }
                  onClick={() =>
                    setFilters({
                      ...filters,
                      businessStatus:
                        filters.businessStatus ===
                        item
                          ? ""
                          : item,
                    })
                  }
                  className={`w-full text-left px-4 py-3 rounded-2xl border capitalize transition ${
                    filters.businessStatus ===
                    item
                      ? "bg-green-600 text-white border-green-600"
                      : "border-slate-200 hover:border-green-400"
                  }`}
                >

                  {item}

                </button>
              )
            )}

            {/* NEGOTIATION */}
            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  underNegotiation:
                    filters.underNegotiation ===
                    "true"
                      ? ""
                      : "true",
                })
              }
              className={`w-full text-left px-4 py-3 rounded-2xl border transition ${
                filters.underNegotiation ===
                "true"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "border-slate-200 hover:border-yellow-400"
              }`}
            >

              Under Negotiation

            </button>

          </div>
        )}

      </div>

      {/* SORT */}
      <div>

        <h3 className="font-bold text-lg mb-4">

          Sort By

        </h3>

        <select
          value={
            filters.sort
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              sort:
                e.target
                  .value,
            })
          }
          className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
        >

          <option value="">
            Latest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="price-low">
            Price Low → High
          </option>

          <option value="price-high">
            Price High → Low
          </option>

        </select>

      </div>

    </div>
  );
}

export default
  FilterSidebar;