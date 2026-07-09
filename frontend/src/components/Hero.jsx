import { Link } from "react-router-dom";
function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-8 py-24 text-center">
      <h1 className="text-6xl font-bold text-slate-900 mb-6">
        Invest with confidence.
      </h1>

      <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
        PrimeHarvest provides investors with a professional platform
        designed for long-term growth and financial opportunity.
      </p>

      <div className="flex justify-center gap-4">
        <Link
  to="/register"
  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold"
>
  Start Investing
</Link>

        <button className="border border-slate-300 px-8 py-4 rounded-2xl font-semibold">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default Hero;