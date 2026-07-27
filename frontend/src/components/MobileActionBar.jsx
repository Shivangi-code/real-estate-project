import {
    SlidersHorizontal,
    ArrowUpDown,
} from "lucide-react";
export default function MobileActionBar({
    activeFilterCount,
    onFilterClick,
    onSortClick,
    onClearClick,
}) {
    return (
        <>
            {/* ================= MOBILE ACTION BAR ================= */}

                    <div
                    className={`
                    flex
                    items-center
                    justify-between

                    gap-3

                    col-span-full

                    transition-all
                    duration-300

                    lg:hidden
                    `}
                    >

                    {/* FILTER BUTTON */}

                    <button
                        onClick={onFilterClick}
                        aria-label="Open property filters"
                        aria-expanded={false}
                        aria-controls="mobile-filter-title"
                        className="
                        flex-1

                        flex
                        items-center
                        justify-center
                        gap-2

                        min-h-[56px]

                        rounded-2xl

                        bg-[#071133]

                        text-white

                        font-semibold

                        shadow-lg

                        transition-all
                        duration-300

                        hover:bg-[#0B1D57]
                    "
                    >

                        <SlidersHorizontal size={18} />

                        Filters

                    </button>

                    {/* SORT */}

                    <button
                        onClick={onSortClick}
                        className="
                        flex-1

                        flex
                        items-center
                        justify-center
                        gap-2

                        min-h-[56px]

                        rounded-2xl

                        border
                        border-slate-300

                        bg-white

                        text-[#071133]

                        font-semibold

                        transition-all
                        duration-300

                        hover:border-[#D4AF37]
                    "
                    >

                        <ArrowUpDown size={18} />

                        Sort

                    </button>

                    {/* CLEAR */}

                    <button
                        onClick={onClearClick}
                        className="
                        shrink-0

                        text-[#D4AF37]

                        font-semibold

                        transition-all
                        duration-300

                        hover:text-[#B88A1D]
                    "
                    >

                        Clear

                    </button>

                    </div>
        </>
    );
}