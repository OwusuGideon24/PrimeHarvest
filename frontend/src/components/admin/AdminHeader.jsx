function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 mb-6 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:static lg:rounded-3xl lg:border lg:p-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-slate-700 transition hover:bg-slate-200 lg:hidden"
          aria-label="Open admin navigation"
        >
          ☰
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl lg:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 hidden text-sm text-slate-500 sm:block">
            Manage PrimeHarvest from one place.
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-3 lg:flex">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            Administrator
          </p>

          <p className="text-xs text-slate-500">
            PrimeHarvest Control Panel
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
          A
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;