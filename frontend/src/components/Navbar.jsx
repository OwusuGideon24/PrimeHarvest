 import { Link } from "react-router-dom";
function Navbar() {
  return (
   
    <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        PrimeHarvest
      </h1>
<Link
  to="/login"
  className="bg-slate-900 text-white px-5 py-2 rounded-xl"
>
  Login
</Link>
    </nav>
  );
}

export default Navbar;