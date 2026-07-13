import { Link } from "react-router-dom";

function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-emerald-100 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-700 p-6 text-white shadow-2xl sm:p-8">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-emerald-200">
                PrimeHarvest Platform
              </p>

              <h3 className="mt-3 text-3xl font-black">
                Built to simplify digital investment management.
              </h3>

              <p className="mt-4 leading-7 text-slate-200">
                PrimeHarvest brings deposits, plans, investments,
                transactions, referrals, and withdrawals together
                in one organized experience.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <AboutStat
                value="1"
                label="Unified dashboard"
              />

              <AboutStat
                value="24/7"
                label="Account access"
              />

              <AboutStat
                value="100%"
                label="Responsive design"
              />

              <AboutStat
                value="Clear"
                label="Transaction history"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            About PrimeHarvest
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Designed for clarity, convenience, and better account control.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            PrimeHarvest is a digital platform designed to help users
            manage their investment activity through a simple and
            organized interface.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            Users can fund their wallets, select available investment
            plans, follow active investments, review transaction
            history, manage referrals, and request withdrawals from
            one central dashboard.
          </p>

          <div className="mt-8 space-y-4">
            <AboutPoint
              title="Simple account management"
              description="Access important account and wallet information without unnecessary complexity."
            />

            <AboutPoint
              title="Transparent activity tracking"
              description="Review deposits, investments, withdrawals, and other wallet transactions clearly."
            />

            <AboutPoint
              title="Responsive user experience"
              description="Use the platform comfortably across mobile, tablet, and desktop devices."
            />
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-7 py-4 text-center font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Create Your Account
            </Link>

            <a
              href="#contact"
              className="rounded-2xl border border-slate-300 bg-white px-7 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <p className="text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        {label}
      </p>
    </div>
  );
}

function AboutPoint({ title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
        ✓
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default About;