import {
useMemo,
useState,
} from "react";

import {
NavLink,
Outlet,
} from "react-router-dom";

import {

LayoutDashboard,

Clock3,

CheckCircle,

XCircle,

ShieldCheck,

Building2,

Users,

BarChart3,

Sparkles,

Trash2,

PlusSquare,

Menu,

X,

ImageIcon,

Activity,

Layers3,

} from "lucide-react";

import { TypeAnimation } from "react-type-animation";
import adminBanner from "../../assets/admin-banner.png";

// ======================================================
// ================= SAFE USER PARSER ===================
// ======================================================

const getSafeUser = () => {

try {

return JSON.parse(

localStorage.getItem(
"user"
) || "{}"
);

} catch (error) {

console.log(
"User Parse Error ❌",
error
);

return {};
}
};
function SidebarItem({
    to,
    icon: Icon,
    label,
    end = false,
    closeMobileMenu,
}) {

    return (

        <NavLink
            to={to}
            end={end}
            onClick={closeMobileMenu}
            className={({ isActive }) => `
                group
                relative
                flex
                items-center

                w-full

                gap-4

                h-[54px]
                px-5

                rounded-2xl

                overflow-hidden

                transition-all
                duration-300

                ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-[#d6a44b]
                        to-[#7b5a21]

                        text-[#08111F]

                        shadow-lg
                        shadow-amber-500/20
                        `
                      : `
                        text-[#D7E2F0]

                        hover:text-white

                        hover:bg-white/[0.08]

                        hover:border hover:border-amber-400/20
                        `
                }
            `}
        >

            <div
    className="
        flex
        items-center
        justify-center

        w-9
        h-9

        flex-shrink-0

        rounded-xl

        bg-white/8

        border
        border-white/10

        group-hover:border-amber-400/50

        group-hover:bg-amber-400/10

        transition-all
    "
>
    <Icon 
      size={18}
      className="
      text-slate-300
      group-hover:text-[#D4AF37]
        transition-colors
        duration-300
      " 
    />
    
</div>

            <span
              className="
                text-[15px]
                font-semibold
                whitespace-nowrap

                text-white/90

                group-hover:text-white

                transition-colors
                duration-300
              "
            >
              {label}
            </span>

        </NavLink>

    );
}
export default function AdminDashboard() {

// ======================================================
// ================= STATES =============================
// ======================================================

const [mobileOpen, setMobileOpen] =
useState(false);

// ======================================================
// ================= USER ===============================
// ======================================================

const user =
useMemo(
() => getSafeUser(),
[]
);


// ======================================================
// ================= CLOSE MOBILE MENU ==================
// ======================================================

const closeMobileMenu = () => {

setMobileOpen(
false
);
};

return (

<>

{/* ====================================================== */}
{/* ================= MOBILE HEADER ====================== */}
{/* ====================================================== */}

<div
className="

lg:hidden

fixed
top-[100px]
left-0
right-0

z-40

bg-white/95
backdrop-blur-md

border-b
border-slate-200

px-5
py-3

flex
items-center
justify-between
shadow-sm
"
>

{/* LEFT */}
<div className="flex items-center gap-4">

<div
className="
  bg-slate-900
  text-white
  p-2
  rounded-xl
"
>

<Building2 size={18} />

</div>

<div>

<h2
  className="
    font-bold
    text-slate-900
  "
>

  Admin Panel

</h2>

<p
  className="
    text-xs
    text-slate-500
  "
>

  Moderation CRM

</p>

</div>

</div>

{/* RIGHT */}
<button

onClick={() =>
setMobileOpen(
  true
)
}

className="

p-2

rounded-xl

bg-slate-100

hover:bg-slate-200

transition
"
>

<Menu size={22} />

</button>

</div>

{/* ====================================================== */}
{/* ================= MAIN LAYOUT ======================== */}
{/* ====================================================== */}

<div
className="
min-h-screen
w-full
flex
relative
"
>

{/* ================= PREMIUM BACKGROUND ================= */}

<div className="fixed inset-0 -z-10 overflow-hidden">

  {/* Main Dark Background */}
  <div
    className="
    absolute
    inset-0
    bg-[#07111F]
    "
  />

  {/* Top Left Blue Glow */}
  <div
    className="
    absolute

    -top-52
    -left-52

    w-[750px]
    h-[750px]

    rounded-full

    bg-cyan-500/10

    blur-[170px]
    "
  />

  {/* Bottom Right Gold Glow */}
  <div
    className="
    absolute

    -bottom-52
    -right-52

    w-[700px]
    h-[700px]

    rounded-full

    bg-amber-400/10

    blur-[170px]
    "
  />

  {/* Center Soft Glow */}
  <div
    className="
    absolute

    top-1/3
    left-1/2

    -translate-x-1/2

    w-[90vw]
    max-w-[900px]
    h-[220px]
    sm:h-[300px]
    lg:h-[400px]

    rounded-full

    bg-white/5

    blur-[180px]
    "
  />

</div>
<div className="absolute top-0 left-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

<div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />





{/* ====================================================== */}
{/* ================= MOBILE OVERLAY ===================== */}
{/* ====================================================== */}

{mobileOpen && (

<div

className="
  fixed
  inset-0

  bg-black/40

  z-40

  lg:hidden
"

onClick={
  closeMobileMenu
}
/>
)}

{/* ====================================================== */}
{/* ================= SIDEBAR ============================ */}
{/* ====================================================== */}

<aside
  className={`
    fixed lg:static
    top-0 left-0
    z-50

    w-[320px]
    min-w-[320px]

    h-screen
    overflow-y-auto
    overflow-x-hidden

    bg-[#08111f]/95
    backdrop-blur-2xl

    border-r border-amber-500/10

    flex flex-col

    transition-transform duration-300

    shadow-[0_0_50px_rgba(0,0,0,0.45)]

    ${
      mobileOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>

{/* ====================================================== */}
{/* ================= SIDEBAR SCROLL ===================== */}
{/* ====================================================== */}

<div
  className="
    px-5
    sm:px-6
    py-4
    pb-24
  "
>

{/* ====================================================== */}
{/* ================= MOBILE CLOSE ======================= */}
{/* ====================================================== */}

<div
  className="
    lg:hidden

    flex
    justify-end

    mb-4
  "
>

  <button

    onClick={
      closeMobileMenu
    }

    className="

      p-2

      rounded-xl

      bg-slate-100

      hover:bg-slate-200

      transition
    "
  >

    <X size={20} />

  </button>

</div>

{/* ====================================================== */}
{/* ================= BRAND ============================== */}
{/* ====================================================== */}

<div className="mb-8">

  <div className="flex items-center gap-4">

    <div
      className="
       bg-gradient-to-br
from-amber-300
via-yellow-500
to-amber-700
text-white

p-3

rounded-2xl

shadow-lg
shadow-amber-500/30
      "
    >

      <Building2 size={22} />

    </div>

    <div>

      <h1
        className="

          text-xl
          sm:text-2xl

          font-bold

          text-white
        "
      >

        Admin Panel

      </h1>

      <p
        className="
          text-sm
          text-slate-400
        "
      >

        Luxury Property Suite

      </p>

    </div>

  </div>

</div>

{/* ====================================================== */}
{/* ================= SYSTEM STATUS ====================== */}
{/* ====================================================== */}

<div
  className="

    grid
    grid-cols-2

    gap-4

    mb-7
  "
>

  <div
    className="
      bg-white/5
      rounded-2xl
      p-4
      border
      border-white/10
    "
  >

    <p
      className="
        text-xs
        text-slate-500
        mb-1
      "
    >

      System

    </p>

    <p
      className="
        font-bold
        text-white
      "
    >

      Active

    </p>

  </div>

  <div
    className="
      bg-white/5
      rounded-2xl
      p-4
      border
      border-white/10
    "
  >

    <p
      className="
        text-xs
        text-slate-500
        mb-1
      "
    >

      Moderation

    </p>

    <p
      className="
        font-bold
        text-green-600
      "
    >

      Live

    </p>

  </div>

</div>

{/* ====================================================== */}
{/* ================= MAIN NAVIGATION ==================== */}
{/* ====================================================== */}

<div
  className="
    mb-3
    px-2

    text-xs
    uppercase
    tracking-wider

    text-amber-300

    font-semibold
  "
>

  Dashboard

</div>

<nav
  className="
    space-y-2
  "
>

  {/* OVERVIEW */}
  <SidebarItem
    to="/admin"
    end
    icon={LayoutDashboard}
    label="Overview"
    closeMobileMenu={closeMobileMenu}
/>

  {/* ANALYTICS */}
  <SidebarItem
    to="/admin/analytics"
    icon={BarChart3}
    label="Analytics"
    closeMobileMenu={closeMobileMenu}
/>

  {/* ACTIVITY */}
  <SidebarItem
    to="/admin/activity"
    icon={Activity}
    label="Activity Feed"
    closeMobileMenu={closeMobileMenu}
/>

</nav>

{/* ====================================================== */}
{/* ================= VERIFICATION ======================= */}
{/* ====================================================== */}

<div
  className="
    mt-8
    mb-3
    px-2

    text-xs
    uppercase
    tracking-wider

    text-cyan-300

    font-semibold
  "
>

  Verification

</div>

<nav
  className="
    space-y-2
  "
>

  {/* PENDING */}
  <SidebarItem
    to="/admin/properties/pending"
    icon={Clock3}
    label="Pending Properties"
    closeMobileMenu={closeMobileMenu}
/>

  {/* APPROVED */}
  <SidebarItem
    to="/admin/properties/approved"
    icon={CheckCircle}
    label="Approved Properties"
    closeMobileMenu={closeMobileMenu}
/>

  {/* REJECTED */}
  <SidebarItem
    to="/admin/properties/rejected"
    icon={XCircle}
    label="Rejected Properties"
    closeMobileMenu={closeMobileMenu}
/>

  {/* DELETED */}
  <SidebarItem
    to="/admin/properties/deleted"
    icon={Trash2}
    label="Deleted Properties"
    closeMobileMenu={closeMobileMenu}
/>

  {/* PROPERTY VERIFICATION */}
  <SidebarItem
    to="/admin/verification-board"
    icon={ShieldCheck}
    label="Verification Board"
    closeMobileMenu={closeMobileMenu}
/>


  {/* IMAGE VERIFICATION */}
  <SidebarItem
    to="/admin/image-verification"
    icon={ImageIcon}
    label="Image Verification"
    closeMobileMenu={closeMobileMenu}
/>

</nav>

{/* ====================================================== */}
{/* ================= OPERATIONS ========================= */}
{/* ====================================================== */}

<div
  className="
    mt-8
    mb-3
    px-2

    text-xs
    uppercase
    tracking-wider

    text-cyan-300

    font-semibold
  "
>

  Operations

</div>

<nav
  className="
    space-y-2
  "
>

  {/* LEADS */}
  <SidebarItem
    to="/admin/leads"
    icon={Users}
    label="Leads Dashboard"
    closeMobileMenu={closeMobileMenu}
/>


  {/* ADD PROPERTY */}
  <SidebarItem
    to="/admin/add-property"
    icon={PlusSquare}
    label="Add Property"
    closeMobileMenu={closeMobileMenu}
/>


  {/* MY PROPERTIES */}
  <SidebarItem
    to="/admin-properties"
    icon={Layers3}
    label="My Properties"
    closeMobileMenu={closeMobileMenu}
/>
</nav>

{/* ====================================================== */}
{/* ================= FOOTER ============================= */}
{/* ====================================================== */}

<div className="pt-8 pb-4">

  <div
    className="

      bg-gradient-to-br

      from-[#2b2110]
      via-[#4a3416]
      to-[#7c5b20]

      rounded-3xl

      p-5

      text-white
      
      shadow-2xl
      shadow-amber-500/20
    "
  >

    <div
      className="
        flex
        items-center
        gap-4
        mb-3
      "
    >

      <Sparkles size={18} />

      <p className="font-semibold">

        Pro Admin Suite

      </p>

    </div>

    <p
      className="
        text-sm
        text-slate-200
        leading-relaxed
      "
    >

      Manage moderation,
      verification,
      analytics and
      operations from one
      centralized CRM.

    </p>

    <div
      className="
        mt-4

        flex
        items-center
        gap-2

        text-sm
      "
    >

      <BarChart3 size={16} />

      Analytics Ready

    </div>

  </div>

</div>

</div>

</aside>

{/* ====================================================== */}
{/* ================= MAIN CONTENT ======================= */}
{/* ====================================================== */}

<main
className="

flex-1

min-h-screen

w-full

mt-[78px]
lg:mt-0
"
>

{/* ====================================================== */}
{/* ================= TOPBAR ============================= */}
{/* ====================================================== */}

<header
className="
relative

mx-4
mt-4

rounded-[28px]

overflow-hidden

bg-gradient-to-br
from-[#07101d]
via-[#0c1726]
to-[#101827]

border
border-[#d6a44b33]

shadow-[0_20px_60px_rgba(0,0,0,.55)]

backdrop-blur-2xl

px-10
py-4

min-h-[150px]
"
>
 <img
    src={adminBanner}
    alt=""
    className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        object-right
        opacity-100
    "
/>
<div
  className="
    absolute
    inset-0
    bg-gradient-to-r
    from-[#07111fc0]
    via-[#07111f70]
    to-[#07111fb5]
  "
/>
{/* Left Gold Glow */}
<div
className="
absolute
-left-20
bottom-0

w-[420px]
h-[220px]

bg-amber-400/20

blur-[100px]
rounded-full
pointer-events-none
"
/>

{/* Right Blue Glow */}
<div
className="
absolute
right-0
top-0

w-[500px]
h-[260px]

bg-cyan-400/10

blur-[130px]
rounded-full

pointer-events-none
"
/>

{/* Soft Center Glow */}
<div
className="
absolute
left-1/2
bottom-0

-translate-x-1/2

w-[700px]
h-[120px]

bg-amber-300/10

blur-[90px]

pointer-events-none
"
/>

<div
className="
relative
z-10

flex
flex-col
lg:flex-row

justify-between

gap-5

items-start
lg:items-center
"
>

  {/* LEFT */}
<div className="flex-1 max-w-[760px]">

<h2
className="
text-[24px]
lg:text-[34px]
font-extrabold
leading-[1.05]
tracking-tight
text-white
"
>
Welcome Back,
<br />

<span
className="
bg-gradient-to-r
from-amber-300
via-yellow-100
to-amber-400
bg-clip-text
text-transparent
"
>
Admin
</span>

</h2>

<TypeAnimation
  sequence={[
    "Welcome to the Property Management Hub",
    2500,
    "Monitor verification, approvals and activity",
    2500,
    "Track leads, analytics and operations seamlessly",
    2500,
    "Everything you need in one dashboard",
    2500,
  ]}
  speed={60}
  repeat={Infinity}
  wrapper="p"
  className="
    mt-4
    text-sm
    lg:text-base
    text-slate-300
    max-w-xl
    leading-8
    min-h-[32px]
  "
/>

<div className="flex gap-4 mt-5 flex-wrap">

  {/* Status chips remain here */}
  <div className="flex gap-4 mt-5 flex-wrap">

  <div className="px-5 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium">
    🟢 Live Analytics
  </div>

  <div className="px-5 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium">
    ⚡ Realtime Monitoring
  </div>

  <div className="px-5 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
    ✔ Verification Active
  </div>

</div>

</div>

</div>

{/* USER AREA */}
<div className="
flex
flex-col
justify-center
items-end
gap-4
min-w-[220px]
"
>


{/* PREMIUM USER CARD */}
<div
className="
w-[220px]

rounded-[24px]

border
border-amber-500/20

bg-[#08111f]/95

backdrop-blur-xl

p-3

shadow-[0_15px_40px_rgba(0,0,0,.45)]
"
>

<div className="flex items-center gap-4">

<div
className="
w-9
h-9

rounded-full

bg-gradient-to-br
from-amber-300
via-yellow-500
to-amber-700

flex
items-center
justify-center

text-white
text-base
font-bold

shadow-lg
shadow-amber-500/30
"
>
👤
</div>

<div>

<p className="text-xs tracking-[3px] uppercase text-amber-300">
Admin 👋
</p>

<p className="text-white text-lg font-semibold mt-1">
{user?.name || "Admin"}
</p>


<p className="text-slate-400 text-xs mt-1 break-all">
{user?.email || "admin@example.com"}
</p>

</div>

</div>

</div>

{/* ACTION BUTTONS */}
<div className="flex gap-1.5">
<NavLink
  to="/"
  className="
flex
items-center
justify-center

min-w-[110px]

px-3
py-2

text-sm

rounded-2xl

bg-gradient-to-r
from-[#8b672e]
via-[#c89a46]
to-[#a97a33]

text-white

font-semibold

border
border-amber-300/40

shadow-[0_10px_30px_rgba(255,190,60,.35)]

hover:scale-105
hover:shadow-[0_15px_40px_rgba(255,190,60,.5)]

transition-all
duration-300
"
>
  Home
</NavLink>

<button
  onClick={() => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }}
  className="
flex
items-center
justify-center

min-w-[110px]

px-3
py-2

text-sm

rounded-2xl

bg-[#101827]

text-white

font-semibold

border
border-amber-500/30

hover:bg-[#172334]

hover:border-amber-400

transition-all
duration-300
"
>
  Logout
</button>

</div>

</div>

</div>

<div
className="
absolute
bottom-0
left-0
right-0

h-px

bg-gradient-to-r
from-transparent
via-amber-400/30
to-transparent
"
/>

</header>

{/* ====================================================== */}
{/* ================= PAGE CONTENT ======================= */}
{/* ====================================================== */}

<section
className="
p-6
sm:p-8

relative
z-10

overflow-x-hidden
"
>

<Outlet />

</section>

</main>

</div>

</>
);
}