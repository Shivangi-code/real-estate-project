import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import PropertyCard from "../../components/PropertyCard";

export default function Properties() {
  const [params] = useSearchParams();

  const city = params.get("city") || "";
  const type = params.get("type") || "";
  const maxPrice = params.get("maxPrice") || "";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(city);
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/property/approved"
      );

      const data = await res.json();

      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let data = [...properties];

    // Search city/location
    if (search) {
      data = data.filter((item) =>
        item.location
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Type
    if (type) {
      data = data.filter(
        (item) =>
          item.type?.toLowerCase() ===
          type.toLowerCase()
      );
    }

    // Max price
    if (maxPrice) {
      data = data.filter(
        (item) =>
          Number(item.price) <= Number(maxPrice)
      );
    }

    // Sorting
    if (sort === "low-high") {
      data.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sort === "high-low") {
      data.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    return data;
  }, [properties, search, sort, type, maxPrice]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 md:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <p className="uppercase text-sm tracking-widest text-slate-300">
            Property Marketplace
          </p>

          <h1 className="text-5xl font-bold mt-2">
            Browse Verified Properties
          </h1>

          <p className="text-slate-300 mt-3">
            Discover homes, flats, plots and commercial spaces.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg p-5 grid lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search city or location"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full outline-none"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 border rounded-2xl px-4 py-3">
            <SlidersHorizontal
              size={18}
              className="text-slate-500"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="w-full outline-none bg-transparent"
            >
              <option value="">
                Sort by Price
              </option>
              <option value="low-high">
                Low to High
              </option>
              <option value="high-low">
                High to Low
              </option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center bg-slate-900 text-white rounded-2xl px-4 py-3 font-semibold">
            {filtered.length} Properties Found
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {loading ? (
          <p>Loading properties...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold">
              No Properties Found
            </h3>

            <p className="text-slate-500 mt-2">
              Try changing search or filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((property, index) => (
              <PropertyCard
                key={property._id}
                data={property}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}