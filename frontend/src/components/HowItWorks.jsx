function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Create Account
            </h3>

            <p className="text-slate-600">
              Register and create your PrimeHarvest investor account.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Verify Identity
            </h3>

            <p className="text-slate-600">
              Complete identity verification to secure your account.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Fund Wallet
            </h3>

            <p className="text-slate-600">
              Deposit funds securely into your investment wallet.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              4
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Start Investing
            </h3>

            <p className="text-slate-600">
              Explore opportunities and monitor your portfolio growth.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;