function AdminStatCard({ title, value, color }) {
  return (

    <div className="bg-white rounded-3xl shadow-sm p-7">

      <p className="text-slate-500 mb-3">
        {title}
      </p>

      <h2 className={`text-4xl font-bold ${color}`}>
        {value}
      </h2>

    </div>

  );
}

export default AdminStatCard;