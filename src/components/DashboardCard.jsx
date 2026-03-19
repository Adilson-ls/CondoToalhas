const DashboardCard = ({ title, count, icon, color }) => (
  <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 ${color}`}>
    <div className="p-3 bg-white/70 rounded-full shadow-sm">{icon}</div>
    <div>
      <div className="text-3xl font-black">{count}</div>
      <div className="text-sm font-medium opacity-80">{title}</div>
    </div>
  </div>
);

export default DashboardCard;
