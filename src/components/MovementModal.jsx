const MovementModal = ({ modal, formData, setFormData, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">{modal.title}</h3>
          {modal.max > 0 && modal.type !== 'discard' && <p className="text-sm text-slate-500 mt-1">Disponível para mover: {modal.max}</p>}
        </div>
        <form onSubmit={onConfirm} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
            <input
              type="number"
              min="1"
              max={modal.max > 0 ? modal.max : undefined}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {modal.type === 'discard' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origem do descarte</label>
              <select
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="stock">Estoque (Limpas)</option>
                <option value="gym">Academia</option>
                <option value="dirty">Cesto (Sujas)</option>
                <option value="laundry">Lavanderia</option>
              </select>
            </div>
          )}

          {modal.requiresResponsible && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Responsável</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Quem está entregando/recebendo?"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 mt-6 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;
