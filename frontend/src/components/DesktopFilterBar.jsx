import {
    Home,
    Building2,
    IndianRupee,
    SlidersHorizontal,
} from "lucide-react";

export default function DesktopFilterBar({
    type,
    setType,
    subType,
    setSubType,
    subTypeOptions,
    maxPrice,
    setMaxPrice,
    sort,
    setSort,
    onClearClick,
}) {
    return (
        <>
            {/* TYPE */}
            <div
                className="
                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    border
                    border-slate-200

                    rounded-2xl

                    px-4

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                "
            >
                <Building2
                    size={18}
                    className="
                        text-slate-400
                        transition-colors
                        duration-300
                    "
                />

                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);

                        // RESET SUBTYPE
                        setSubType("");
                    }}
                    className="
                        w-full
                        bg-transparent
                        outline-none

                        text-[15px]

                        cursor-pointer
                    "
                >
                    <option value="">
                        All Types
                    </option>

                    <option value="Residential">
                        Residential
                    </option>

                    <option value="Commercial">
                        Commercial
                    </option>

                    <option value="Agriculture">
                        Agriculture
                    </option>
                </select>
            </div>

            {/* SUB TYPE */} 
            <div
                className="
                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    border
                    border-slate-200

                    rounded-2xl

                    px-4

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                "
            >
                <Home
                    size={18}
                    className="
                        text-slate-400
                        transition-colors
                        duration-300
                    "
                />

                <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="
                        w-full
                        outline-none
                        bg-transparent
                        text-[15px]
                        cursor-pointer
                    "
                >
                    <option value="">
                        All Sub Types
                    </option>

                    {type &&
                        subTypeOptions[type]?.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        ))}
                </select>
            </div>

            {/* MAX PRICE */}
            <div
                className="
                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    border
                    border-slate-200

                    rounded-2xl

                    px-4

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                "
            >
                <IndianRupee
                    size={18}
                    className="
                        text-slate-400
                        transition-colors
                        duration-300
                    "
                />

                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="
                        w-full
                        bg-transparent
                        outline-none

                        text-[15px]

                        placeholder:text-slate-400
                    "
                />
            </div>

            {/* SORT */}
            <div
                className="
                    flex
                    items-center
                    gap-3

                    min-h-[58px]

                    border
                    border-slate-200

                    rounded-2xl

                    px-4

                    transition-all
                    duration-300

                    hover:border-[#D4AF37]

                    focus-within:border-[#D4AF37]
                    focus-within:ring-2
                    focus-within:ring-[#D4AF37]/20
                "
            >
                <SlidersHorizontal
                    size={18}
                    className="
                        text-slate-400
                        transition-colors
                        duration-300
                    "
                />

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="
                        w-full
                        bg-transparent
                        outline-none

                        text-[15px]

                        cursor-pointer
                    "
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

            {/* CLEAR */}
            <div className="flex items-center justify-center">
                <button
                    onClick={onClearClick}
                    className="
                        text-[#D4AF37]
                        font-semibold

                        transition-all
                        duration-300

                        hover:text-[#B88A1D]
                        hover:underline
                    "
                >
                    Clear Filters
                </button>
            </div>
            
        </>
    );
}