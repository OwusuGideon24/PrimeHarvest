import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-900 to-emerald-600 text-xl font-black text-white shadow-lg">
            P
          </div>

          <div>
            <p className="text-xl font-black tracking-tight text-slate-950">
              PrimeHarvest
            </p>

            <p className="hidden text-xs font-medium text-slate-500 sm:block">
              Invest. Grow. Prosper.
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <a
            href="#features"
            className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            Why Us
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            Contact
          </a>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Create Account
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="text-xl">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <a
              href="#features"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Why Us
            </a>

            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              How It Works
            </a>

            <a
              href="#about"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              About
            </a>

            <a
              href="#contact"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Contact
            </a>

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-gradient-to-r from-slate-950 via-emerald-900 to-emerald-700 px-4 py-3 text-center font-semibold text-white"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;