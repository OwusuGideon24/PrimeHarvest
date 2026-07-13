function Features() {
  const features = [
    {
      icon: "🔒",
      title: "Secure Account Access",
      description:
        "Protected authentication and controlled access help keep user accounts and financial activity safer.",
    },
    {
      icon: "📊",
      title: "Clear Portfolio Tracking",
      description:
        "View balances, investments, transaction history, and earnings from one organized dashboard.",
    },
    {
      icon: "⚡",
      title: "Simple Transactions",
      description:
        "Submit deposits, choose investment plans, and request withdrawals through a straightforward process.",
    },
    {
      icon: "📱",
      title: "Accessible Anywhere",
      description:
        "Manage your account conveniently from mobile phones, tablets, and desktop computers.",
    },
  ];

  return (
    <section
      id="features"
      className="scroll-mt-24 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Why PrimeHarvest
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              A cleaner way to manage your investment journey.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              PrimeHarvest brings essential account, wallet, investment,
              and transaction tools together in one easy-to-use platform.
            </p>
          </div>

          <div className="hidden rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-5 lg:block">
            <p className="text-sm font-semibold text-emerald-700">
              Built for convenience
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-950">
              One dashboard
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Complete account visibility
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-xl sm:p-7"
            >
              <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-emerald-100 opacity-70 transition group-hover:scale-125" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-900 to-emerald-700 text-2xl shadow-lg">
                    {feature.icon}
                  </div>

                  <span className="text-sm font-black text-slate-300">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  PrimeHarvest feature
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-emerald-700 p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-emerald-200">
                Everything in one place
              </p>

              <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                Stay informed at every stage of your account activity.
              </h3>

              <p className="mt-4 max-w-2xl leading-7 text-slate-200">
                Review balances, monitor active investments, track
                transactions, and manage account actions without moving
                between disconnected tools.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat value="24/7" label="Access" />
              <Stat value="100%" label="Responsive" />
              <Stat value="1" label="Dashboard" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
      <p className="text-xl font-black text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-300">
        {label}
      </p>
    </div>
  );
}

export default Features;