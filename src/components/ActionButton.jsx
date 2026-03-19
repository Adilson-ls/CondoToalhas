const ActionButton = ({ title, desc, icon, onClick, disabled, variant = 'default' }) => {
  const baseClass = 'flex items-start gap-3 p-4 rounded-xl text-left transition-all border outline-none';
  const variants = {
    default: 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700',
    primary: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100 text-blue-800',
    success: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100 text-emerald-800',
    danger: 'bg-red-50 border-red-100 hover:border-red-300 hover:bg-red-100 text-red-800',
  };
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer active:scale-[0.98]';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant] ?? variants.default} ${disabledClass}`}
    >
      <div className="mt-1 bg-white/50 p-1.5 rounded-md shadow-sm">{icon}</div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs opacity-70 mt-0.5">{desc}</div>
      </div>
    </button>
  );
};

export default ActionButton;
