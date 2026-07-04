import { motion } from "framer-motion";

import {
  Building2,
  ShieldCheck,
  BadgeCheck,
  Home,
  Landmark,
  Users,
  Target,
} from "lucide-react";

import "../../styles/about.css";

function About() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
<section
  className="
    bg-gradient-to-r
    from-slate-900
    to-slate-700
    text-white
    pt-32
    sm:pt-36
    md:pt-40
    pb-16
    sm:pb-20
    px-4
    sm:px-6
  "
>
  <div className="max-w-6xl mx-auto text-center">

    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
    >

      <p className="uppercase tracking-[6px] text-slate-300 text-sm mb-5">
        Trusted Real Estate Platform
      </p>

      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        About Housify Realty
      </h1>

      <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">
        Your trusted real estate partner helping buyers,
        sellers and investors with verified property solutions.
      </p>

    </motion.div>

  </div>
</section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="space-y-6"
          >

            {/* COMPANY INFO */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-5">

                <Building2 className="text-slate-700" />

                <h2 className="text-3xl font-bold">
                  Who We Are
                </h2>

              </div>

              <div className="space-y-5 text-slate-600 leading-7">

                <p>
                  Welcome to <strong>Housify Realty</strong>,
                  a trusted real estate platform based in Jabalpur.
                  Founded in March 2026, we are dedicated to helping
                  people find the perfect property with transparency,
                  reliability and professional support.
                </p>

                <p>
                  We specialize in connecting buyers, sellers and
                  investors with the best residential and commercial
                  properties in Jabalpur and nearby areas.
                </p>

                <p>
                  Our goal is to make property buying and selling
                  simple, secure and completely hassle-free.
                </p>

              </div>
            </div>

            {/* FEATURES */}
            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-white rounded-3xl p-6 shadow-sm">

                <ShieldCheck className="text-green-600 mb-4" />

                <h3 className="font-bold text-xl">
                  Verified Listings
                </h3>

                <p className="text-slate-500 mt-2 text-sm leading-6">

                  Trusted and verified property options for safe investments.

                </p>

              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm">

                <Users className="text-blue-600 mb-4" />

                <h3 className="font-bold text-xl">
                  Customer Support
                </h3>

                <p className="text-slate-500 mt-2 text-sm leading-6">

                  Personalized guidance and professional assistance.

                </p>

              </div>

            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="space-y-6"
          >

            {/* SERVICES */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">

              <div className="mb-6">

                <p className="uppercase tracking-widest text-sm text-slate-500">

                  What We Offer

                </p>

                <h2 className="text-4xl font-bold mt-2">

                  Our Services

                </h2>

              </div>

              <div className="space-y-5">

                <div className="flex items-start gap-4">

                  <div className="bg-slate-100 p-3 rounded-2xl">

                    <Home className="text-slate-700" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      Residential Properties
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Buying and selling residential homes and apartments.
                    </p>

                  </div>
                </div>

                <div className="flex items-start gap-4">

                  <div className="bg-slate-100 p-3 rounded-2xl">

                    <Landmark className="text-slate-700" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      Plot & Land Deals
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Verified plots and land investment opportunities.
                    </p>

                  </div>
                </div>

                <div className="flex items-start gap-4">

                  <div className="bg-slate-100 p-3 rounded-2xl">

                    <BadgeCheck className="text-slate-700" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      Rental Assistance
                    </h3>

                    <p className="text-slate-500 text-sm">
                      Helping clients find reliable rental properties.
                    </p>

                  </div>
                </div>

              </div>
            </div>

            {/* MISSION */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-8 shadow-sm">

              <Target className="mb-5" size={36} />

              <h2 className="text-3xl font-bold mb-4">

                Our Mission

              </h2>

              <p className="text-slate-300 leading-7">

                To provide transparent and trustworthy real estate
                solutions while helping clients find the perfect
                place they can proudly call home.

              </p>

            </div>

          </motion.div>

        </div>

        {/* WHY CHOOSE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="mt-12"
        >

          <div className="bg-white rounded-3xl p-8 shadow-sm">

            <div className="text-center mb-8">

              <p className="uppercase tracking-widest text-sm text-slate-500">

                Why People Trust Us

              </p>

              <h2 className="text-4xl font-bold mt-2">

                Why Choose Housify Realty

              </h2>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="bg-slate-50 rounded-2xl p-6 text-center">

                <h3 className="font-bold text-lg mb-2">
                  Local Expertise
                </h3>

                <p className="text-slate-500 text-sm leading-6">
                  Strong knowledge of the Jabalpur real estate market.
                </p>

              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-center">

                <h3 className="font-bold text-lg mb-2">
                  Trusted Deals
                </h3>

                <p className="text-slate-500 text-sm leading-6">
                  Transparent and secure property transactions.
                </p>

              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-center">

                <h3 className="font-bold text-lg mb-2">
                  Verified Properties
                </h3>

                <p className="text-slate-500 text-sm leading-6">
                  Carefully checked and verified property listings.
                </p>

              </div>

              <div className="bg-slate-50 rounded-2xl p-6 text-center">

                <h3 className="font-bold text-lg mb-2">
                  Professional Support
                </h3>

                <p className="text-slate-500 text-sm leading-6">
                  Dedicated assistance throughout the entire process.
                </p>

              </div>

            </div>

          </div>
        </motion.div>

      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16 px-6">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-5">

            Making Real Estate Simple & Trusted

          </h2>

          <p className="text-slate-300 text-lg leading-8 max-w-3xl mx-auto">

            At Housify Realty, we believe that finding the right
            property should be simple, safe and rewarding for everyone.

          </p>

        </div>
      </section>

    </div>
  );
}

export default About;