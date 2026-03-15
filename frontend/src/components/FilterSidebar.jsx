import { useState } from "react";

function FilterSidebar() {

  const [openSection, setOpenSection] = useState("type");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="filter-sidebar">

      <h3 className="filter-title">Filters</h3>

      {/* PROPERTY TYPE */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("type")}>
          Property Type
        </div>

        {openSection === "type" && (
          <div className="section-body">
            <label><input type="checkbox" /> Residential</label>
            <label><input type="checkbox" /> Commercial</label>
            <label><input type="checkbox" /> Plot / Land</label>
            <label><input type="checkbox" /> Farmhouse</label>
          </div>
        )}
      </div>

      {/* BUDGET */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("budget")}>
          Budget (₹ Lakhs)
        </div>

        {openSection === "budget" && (
          <div className="section-body row-inputs">
            <input type="number" placeholder="Min" />
            <input type="number" placeholder="Max" />
          </div>
        )}
      </div>

      {/* AREA */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("area")}>
          Area (sq ft)
        </div>

        {openSection === "area" && (
          <div className="section-body row-inputs">
            <input type="number" placeholder="Min" />
            <input type="number" placeholder="Max" />
          </div>
        )}
      </div>

      {/* CONSTRUCTION STATUS */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("status")}>
          Construction Status
        </div>

        {openSection === "status" && (
          <div className="section-body">
            <label><input type="checkbox" /> Ready to Move</label>
            <label><input type="checkbox" /> Under Construction</label>
            <label><input type="checkbox" /> New Launch</label>
          </div>
        )}
      </div>

      {/* LOCALITY */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("locality")}>
          Locality
        </div>

        {openSection === "locality" && (
          <div className="section-body">
            <input type="text" placeholder="Search locality..." />
            <label><input type="checkbox" /> Vijay Nagar</label>
            <label><input type="checkbox" /> Napier Town</label>
            <label><input type="checkbox" /> Adhartal</label>
            <label><input type="checkbox" /> Tilhari</label>
          </div>
        )}
      </div>

      {/* MORE FILTERS */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("more")}>
          More Filters
        </div>

        {openSection === "more" && (
          <div className="section-body">
            <label><input type="checkbox" /> Parking</label>
            <label><input type="checkbox" /> Lift</label>
            <label><input type="checkbox" /> Furnished</label>
            <label><input type="checkbox" /> Corner Property</label>
          </div>
        )}
      </div>

    </div>
  );
}

export default FilterSidebar;