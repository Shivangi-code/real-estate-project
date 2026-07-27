import {
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    X,
} from "lucide-react";
export default function FloatingFilterActions({
    stage,
    isSearchExpanded,
    activeFilterCount,
    onSearchClick,
    onFilterClick,
    onSortClick,
    onClearClick,
}) {
    console.log("FloatingFilterActions stage:", stage);
    // Original filter bar is visible.
    if (stage === "normal" || stage === "sticky") {
        return null;
    }

    return (
        <>

            {/* ================= PILL MODE ================= */}
            {true && (
                <div
                    className={`
                        fixed
                        ${isSearchExpanded ? "top-20" : "top-0.5"}
                        left-1/2
                        -translate-x-1/2

                        z-[1100]

                        w-[calc(100%-2rem)]
                        max-w-sm

                        lg:hidden

                        transition-all
                        duration-500
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        will-change-transform
                    `}
                >
                    <div
                        className="
                            bg-white/85
                            backdrop-blur-2xl

                            border
                            border-white/40

                            rounded-full

                            px-3
                            py-2

                            flex
                            items-center
                            justify-evenly

                            shadow-[0_20px_60px_rgba(15,23,42,0.18)]

                            ring-1
                            ring-white/30
                        "
                    >
                        <button
                            onClick={onSearchClick}
                            aria-label="Search"
                            className="
                                w-11
                                h-11

                                rounded-full

                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Search size={20} />
                        </button>

                        <button
                            onClick={onFilterClick}
                            aria-label="Open Filters"
                            className="
                                relative

                                w-11
                                h-11

                                rounded-full

                                flex
                                items-center
                                justify-center
                            "
                        >
                            <SlidersHorizontal size={20} />

                            {activeFilterCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -top-1
                                        -right-2

                                        min-w-5
                                        h-5

                                        rounded-full

                                        bg-red-500
                                        text-white

                                        text-[10px]
                                        font-bold

                                        flex
                                        items-center
                                        justify-center

                                        px-1
                                    "
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={onSortClick}
                            aria-label="Sort"
                            className="
                                w-11
                                h-11

                                rounded-full

                                flex
                                items-center
                                justify-center
                            "
                        >
                            <ArrowUpDown size={20} />
                        </button>

                        <button
                            onClick={onClearClick}
                            aria-label="Clear Filters"
                            className="
                                w-11
                                h-11

                                rounded-full

                                flex
                                items-center
                                justify-center

                                text-red-600
                            "
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* ================= BUBBLE MODE ================= */}
            {stage === "bubble" && (
                <div
                    className="
                        fixed
                        top-1/2
                        right-4
                        -translate-y-1/2

                        z-[1100]

                        lg:hidden
                    "
                >
                    <button
                        onClick={onFilterClick}
                        className="
                            relative

                            w-14
                            h-14

                            rounded-full

                            bg-white/90
                            backdrop-blur-2xl

                            border
                            border-white/40

                            shadow-[0_20px_60px_rgba(15,23,42,0.22)]

                            ring-1
                            ring-white/30

                            flex
                            items-center
                            justify-center
                        "
                    >
                        <SlidersHorizontal size={22} />

                        {activeFilterCount > 0 && (
                            <span
                                className="
                                    absolute
                                    -top-1
                                    -right-1

                                    min-w-6
                                    h-6

                                    rounded-full

                                    bg-red-500
                                    text-white

                                    text-xs

                                    flex
                                    items-center
                                    justify-center

                                    px-1
                                "
                            >
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            )}
        </>
    );
}