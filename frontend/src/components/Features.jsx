function Features() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
          Why Choose PrimeHarvest?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-slate-50 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              🔒 Secure Platform
            </h3>

            <p className="text-slate-600">
              Your account is protected using modern security practices and
              authentication systems.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              📈 Growth Focused
            </h3>

            <p className="text-slate-600">
              Built to help investors track and manage opportunities over time.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              🌎 Accessible Anywhere
            </h3>

            <p className="text-slate-600">
              Access your dashboard from mobile, tablet, or desktop devices.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              🤝 Dedicated Support
            </h3>

            <p className="text-slate-600">
              Our support team is available to assist whenever you need help.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Features;