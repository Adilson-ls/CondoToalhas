import { Trash, User } from 'lucide-react';

const HistoryTable = ({ history, isLoading, onDelete }) => {
  if (isLoading) {
    return <p className="text-center text-slate-400 py-6">Carregando dados na Nuvem...</p>;
  }
  if (!history.length) {
    return <p className="text-center text-slate-400 py-6">Nenhuma movimentação registrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 rounded-tl-lg">Data/Hora</th>
            <th className="px-4 py-3">Ação</th>
            <th className="px-4 py-3">Qtd</th>
            <th className="px-4 py-3">Responsável</th>
            <th className="px-4 py-3 rounded-tr-lg">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{item.date}</td>
              <td className="px-4 py-3 font-medium text-slate-700">{item.action}</td>
              <td className="px-4 py-3">
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-bold">{item.amount}</span>
              </td>
              <td className="px-4 py-3 flex items-center gap-2"><User size={14} className="text-slate-400" />{item.responsible}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Deletar registro"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
