function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Simple Process
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
            How PrimeHarvest Works
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Get started in four clear steps and manage your
            investment activity from one convenient dashboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StepCard
            number="1"
            title="Create Account"
            description="Register and create your PrimeHarvest investor account."
          />

          <StepCard
            number="2"
            title="Secure Your Account"
            description="Complete your account details and keep your login information protected."
          />

          <StepCard
            number="3"
            title="Fund Your Wallet"
            description="Submit a deposit request using one of the available payment methods."
          />

          <StepCard
            number="4"
            title="Start Investing"
            description="Choose an investment plan and track your portfolio from your dashboard."
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, title, description }) {
  return (
    <article className="group relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-900 to-emerald-700 text-xl font-black text-white shadow-lg">
        {number}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

      <div className="absolute bottom-0 left-7 right-7 h-1 origin-left scale-x-0 rounded-full bg-emerald-600 transition group-hover:scale-x-100" />
    </article>
  );
}

export default HowItWorks;