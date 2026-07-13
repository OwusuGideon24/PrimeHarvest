function AdminStatCard({
  title,
  value,
  color = "text-slate-900",
  icon = "📊",
  description = "",
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2
            className={`mt-3 text-2xl font-bold leading-tight sm:text-3xl xl:text-4xl ${color}`}
          >
            {value}
          </h2>

          {description && (
            <p className="mt-3 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
          {icon}
        </div>
      </div>
    </article>
  );
}

export default AdminStatCard;