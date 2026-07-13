import { Link } from "react-router-dom";

function Hero() {
  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-800">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-400 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-300 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[680px] w-full max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            A smarter way to grow your funds
          </div>

          <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build your future with{" "}
            <span className="text-emerald-300">
              confident investing.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg lg:mx-0">
            PrimeHarvest gives users a clear and convenient platform
            for managing deposits, choosing investment plans, tracking
            returns, and requesting withdrawals.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/register"
              className="rounded-2xl bg-white px-8 py-4 text-center font-bold text-emerald-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-2xl"
            >
              Start Investing
            </Link>

            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Learn More
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black text-white">
                Simple
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Easy account setup
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black text-white">
                Flexible
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Multiple investment plans
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black text-white">
                Transparent
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Track every transaction
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-100">
                  Portfolio overview
                </p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Your growth dashboard
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300 text-xl font-black text-emerald-950">
                P
              </div>
            </div>

            <div className="mt-7 rounded-2xl bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Available balance
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-950">
                    $5,000.00
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Active plans
                  </p>

                  <p className="mt-2 text-xl font-black text-slate-900">
                    3
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-700">
                    Total returns
                  </p>

                  <p className="mt-2 text-xl font-black text-emerald-700">
                    +$875.00
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg">
                  ↓
                </div>

                <p className="mt-2 text-xs font-semibold text-white">
                  Deposit
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg">
                  📈
                </div>

                <p className="mt-2 text-xs font-semibold text-white">
                  Invest
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg">
                  ↑
                </div>

                <p className="mt-2 text-xs font-semibold text-white">
                  Withdraw
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;