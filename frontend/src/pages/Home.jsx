import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";
import Contact from "../components/Contact";

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <About />
        <Contact />
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-5 py-8 text-center text-sm text-slate-400">
        <p>
          © {new Date().getFullYear()} PrimeHarvest. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;