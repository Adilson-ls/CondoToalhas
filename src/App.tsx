import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  History, 
  Package, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  ArrowLeft, 
  Plus, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Moon, 
  Sun,
  X,
  ChevronRight,
  ArrowRightLeft,
  User,
  Info,
  type LucideIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InventoryState, Transaction, TransactionType, AlertThresholds } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const INITIAL_INVENTORY: InventoryState = {
  clean: 84,
  gym: 12,
  dirty: 45,
  laundry: 80
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-8825',
    type: 'TRANSFER',
    amount: 20,
    responsible: 'Ricardo M.',
    timestamp: new Date(),
    description: 'Estoque ➔ Academia',
    category: 'Academia'
  },
  {
    id: 'TRX-8821',
    type: 'LAUNDRY_SEND',
    amount: 15,
    responsible: 'João Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    description: 'Enviado para Lavandaria',
    category: 'Lavandaria'
  },
  {
    id: 'TRX-8819',
    type: 'LAUNDRY_RECEIVE',
    amount: 20,
    responsible: 'Maria Silva',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    description: 'Recebido da Lavandaria',
    category: 'Estoque'
  },
  {
    id: 'TRX-8790',
    type: 'OUT',
    amount: 42,
    responsible: 'Carlos R.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    description: 'Distribuição na Piscina',
    category: 'Piscina'
  }
];

const CHART_DATA = [
  { name: 'Out', limpas: 400, uso: 300 },
  { name: 'Nov', limpas: 550, uso: 450 },
  { name: 'Dez', limpas: 700, uso: 600 },
  { name: 'Jan', limpas: 450, uso: 350 },
  { name: 'Fev', limpas: 600, uso: 500 },
  { name: 'Mar', limpas: 850, uso: 750 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'inventory' | 'settings'>('dashboard');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'in' | 'out'>('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inventory, setInventory] = useState<InventoryState>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [showModal, setShowModal] = useState<'use' | 'transfer' | 'laundry' | null>(null);
  const [thresholds, setThresholds] = useState<AlertThresholds>({ clean: 25, dirty: 40, laundry: 15 });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const totalInventory = useMemo(() => 
    inventory.clean + inventory.gym + inventory.dirty + inventory.laundry
  , [inventory]);

  const handleAction = (type: TransactionType, amount: number, responsible: string, description: string) => {
    const newTrx: Transaction = {
      id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
      type,
      amount,
      responsible,
      timestamp: new Date(),
      description,
      category: type === 'TRANSFER' ? 'Academia' : 'Geral'
    };

    setTransactions([newTrx, ...transactions]);
    
    // Simple logic for inventory updates
    setInventory(prev => {
      const next = { ...prev };
      if (type === 'OUT') next.clean -= amount;
      if (type === 'TRANSFER') {
        next.clean -= amount;
        next.gym += amount;
      }
      if (type === 'LAUNDRY_SEND') {
        next.dirty -= amount;
        next.laundry += amount;
      }
      if (type === 'LAUNDRY_RECEIVE') {
        next.laundry -= amount;
        next.clean += amount;
      }
      return next;
    });

    setShowModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">CondoToalhas</h1>
            <p className="text-xs text-slate-500">Inventário Pro</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={LayoutGrid} 
            label="Painel" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={History} 
            label="Histórico" 
          />
          <NavItem 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')} 
            icon={Package} 
            label="Estoque" 
          />
          <NavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={Settings} 
            label="Configurações" 
          />
        </nav>

        <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
          <p className="text-xs text-slate-500 mb-1">Unidade</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Torre Alpha - Administrativo</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 ios-blur border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-4 justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="size-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <Package size={20} />
              </div>
              <h1 className="text-slate-900 dark:text-white text-lg font-bold">CondoToalhas</h1>
            </div>
            
            <div className="hidden lg:block">
              <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                {activeTab === 'dashboard' && 'Resumo do Inventário'}
                {activeTab === 'history' && 'Histórico de Transações'}
                {activeTab === 'inventory' && 'Controle de Estoque'}
                {activeTab === 'settings' && 'Ajustes do Sistema'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Search size={20} />
              </button>
              <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 relative shadow-sm">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 size-2 bg-orange-500 rounded-full border-2 border-white dark:border-slate-800"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                {/* Primary Actions at the Top */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setShowModal('use')}
                    className="flex items-center gap-4 p-5 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all hover:bg-orange-600 group"
                  >
                    <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={28} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold">Registrar Uso</p>
                      <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Saída de Toalhas</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowModal('transfer')}
                    className="flex items-center gap-4 p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all hover:bg-blue-700 group"
                  >
                    <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRightLeft size={28} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold">Transferir</p>
                      <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Movimentar Estoque</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowModal('laundry')}
                    className="flex items-center gap-4 p-5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all hover:bg-emerald-700 group"
                  >
                    <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Truck size={28} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold">Lavanderia</p>
                      <p className="text-xs text-white/80 font-medium uppercase tracking-wider">Enviar para Lavar</p>
                    </div>
                  </button>
                </section>

                {inventory.gym < thresholds.clean && (
                  <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30 rounded-2xl">
                    <AlertTriangle className="text-orange-600" size={20} />
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Atenção: <span className="font-bold">Estoque de Academia baixo</span> (Apenas {inventory.gym} unidades).
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                  <StatCard 
                    label="Limpas (Estoque)" 
                    value={inventory.clean} 
                    icon={Package} 
                    color="emerald" 
                    tag="Estoque"
                  />
                  <StatCard 
                    label="Limpas (Academia)" 
                    value={inventory.gym} 
                    icon={TrendingUp} 
                    color="emerald" 
                    tag="Academia"
                  />
                  <StatCard 
                    label="Sujas" 
                    value={inventory.dirty} 
                    icon={TrendingUp} 
                    color="orange" 
                    tag="Pendente"
                  />
                  <StatCard 
                    label="Em Trânsito" 
                    value={inventory.laundry} 
                    icon={Truck} 
                    color="blue" 
                    tag="Lavandaria"
                  />
                  <StatCard 
                    label="Total Geral" 
                    value={totalInventory} 
                    icon={Package} 
                    color="slate" 
                    tag="Total"
                    className="col-span-2 lg:col-span-1"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold">Consumo Mensal</h3>
                        <p className="text-xs text-slate-500">Fluxo de toalhas nos últimos 6 meses</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Limpas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-orange-500"></span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Uso</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          />
                          <YAxis hide />
                          <Tooltip 
                            cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                              borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                              borderRadius: '12px',
                              color: isDarkMode ? '#fff' : '#000'
                            }}
                          />
                          <Bar dataKey="limpas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                          <Bar dataKey="uso" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <div className="space-y-6">
                    <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 lg:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold">Atividade Recente</h3>
                        <button onClick={() => setActiveTab('history')} className="text-orange-500 text-sm font-semibold hover:underline">Ver Tudo</button>
                      </div>
                      <div className="space-y-4">
                        {transactions.slice(0, 3).map(trx => (
                          <ActivityItem key={trx.id} trx={trx} />
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setHistoryFilter('all')}
                        className={cn(
                          "text-sm font-bold pb-1 transition-all",
                          historyFilter === 'all' ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        Toda a Atividade
                      </button>
                      <button 
                        onClick={() => setHistoryFilter('in')}
                        className={cn(
                          "text-sm font-bold pb-1 transition-all",
                          historyFilter === 'in' ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        Entradas
                      </button>
                      <button 
                        onClick={() => setHistoryFilter('out')}
                        className={cn(
                          "text-sm font-bold pb-1 transition-all",
                          historyFilter === 'out' ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        Saídas
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
                          setTransactions([]);
                        }
                      }}
                      className="px-4 py-1 text-[10px] text-transparent hover:text-slate-300 dark:hover:text-slate-700 transition-colors cursor-default select-none"
                      title="Limpar Histórico"
                    >
                      Limpar
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions
                      .filter(trx => {
                        if (historyFilter === 'all') return true;
                        if (historyFilter === 'in') return trx.type === 'IN' || trx.type === 'LAUNDRY_RECEIVE';
                        if (historyFilter === 'out') return trx.type === 'OUT' || trx.type === 'LAUNDRY_SEND';
                        return true;
                      }).length === 0 && (
                        <div className="p-12 text-center">
                          <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <History size={32} />
                          </div>
                          <p className="text-slate-500 font-medium">Nenhuma transação encontrada para este filtro.</p>
                        </div>
                      )}
                    {transactions
                      .filter(trx => {
                        if (historyFilter === 'all') return true;
                        if (historyFilter === 'in') return trx.type === 'IN' || trx.type === 'LAUNDRY_RECEIVE';
                        if (historyFilter === 'out') return trx.type === 'OUT' || trx.type === 'LAUNDRY_SEND';
                        return true;
                      })
                      .map(trx => (
                      <div key={trx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "size-12 rounded-full flex items-center justify-center",
                            trx.type === 'OUT' || trx.type === 'LAUNDRY_SEND' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          )}>
                            {trx.type === 'TRANSFER' ? <ArrowRightLeft size={24} /> : trx.type === 'LAUNDRY_SEND' ? <Truck size={24} /> : <CheckCircle2 size={24} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{trx.description}</p>
                            <p className="text-xs text-slate-500">Resp: {trx.responsible} • {format(trx.timestamp, "HH:mm '•' dd MMM", { locale: ptBR })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-lg font-bold",
                            trx.type === 'OUT' || trx.type === 'LAUNDRY_SEND' ? "text-rose-600" : "text-emerald-600"
                          )}>
                            {trx.type === 'OUT' || trx.type === 'LAUNDRY_SEND' ? '-' : '+'}{trx.amount}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Unidades</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                {/* Inventory Header Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Disponível</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{inventory.clean + inventory.gym}</p>
                      <span className="text-xs font-medium text-emerald-500">Limpas</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Processamento</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{inventory.dirty + inventory.laundry}</p>
                      <span className="text-xs font-medium text-orange-500">Sujas/Lav.</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giro Mensal</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">1.2k</p>
                      <span className="text-xs font-medium text-blue-500">+12%</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Patrimônio</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalInventory}</p>
                      <span className="text-xs font-medium text-slate-500">Total</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <section className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Estado de Conservação</h4>
                        <p className="text-sm text-slate-500">Análise qualitativa do patrimônio têxtil</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Novas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Bom Estado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-3 rounded-full bg-orange-500"></div>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Desgaste</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-4xl font-bold text-emerald-500 mb-1">72%</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Novas</p>
                        <p className="text-xs text-slate-500 mt-2">Itens adquiridos nos últimos 3 meses com fibras intactas.</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-4xl font-bold text-blue-500 mb-1">18%</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Bom Estado</p>
                        <p className="text-xs text-slate-500 mt-2">Uso regular, maciez preservada e sem fios puxados.</p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-4xl font-bold text-orange-500 mb-1">10%</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Desgaste</p>
                        <p className="text-xs text-slate-500 mt-2">Próximas ao fim da vida útil. Sugerido reposição em breve.</p>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md mx-auto space-y-6"
              >
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Notificações de Estoque</h3>
                    <p className="text-xs text-slate-500">Receber alertas de limites mínimos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Limites por Categoria</h2>
                  <ThresholdSlider 
                    label="Limpas" 
                    value={thresholds.clean} 
                    onChange={(v) => setThresholds({ ...thresholds, clean: v })} 
                    color="emerald"
                  />
                  <ThresholdSlider 
                    label="Sujas" 
                    value={thresholds.dirty} 
                    onChange={(v) => setThresholds({ ...thresholds, dirty: v })} 
                    color="orange"
                  />
                  <ThresholdSlider 
                    label="Lavanderia" 
                    value={thresholds.laundry} 
                    onChange={(v) => setThresholds({ ...thresholds, laundry: v })} 
                    color="blue"
                  />
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                  Guardar Configurações
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 ios-blur border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-3 flex justify-around items-center z-40">
          <MobileNavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={LayoutGrid} 
            label="Painel" 
          />
          <MobileNavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={History} 
            label="Histórico" 
          />
          <MobileNavItem 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')} 
            icon={Package} 
            label="Estoque" 
          />
          <MobileNavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={Settings} 
            label="Ajustes" 
          />
        </nav>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {showModal === 'use' ? 'Registrar Uso' : showModal === 'transfer' ? 'Transferir para Academia' : 'Enviar para Lavanderia'}
                </h3>
                <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const amount = Number(formData.get('amount'));
                  const responsible = formData.get('responsible') as string;
                  const reason = formData.get('reason') as string;
                  
                  if (showModal === 'use') {
                    handleAction('OUT', amount, responsible, reason);
                  } else if (showModal === 'transfer') {
                    handleAction('TRANSFER', amount, responsible, 'Transferência para Academia');
                  } else if (showModal === 'laundry') {
                    handleAction('LAUNDRY_SEND', amount, responsible, 'Enviado para Lavanderia');
                  }
                }}
                className="p-6 space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Quantidade</label>
                  <div className="relative">
                    <input 
                      name="amount"
                      type="number" 
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-900 dark:text-white" 
                      placeholder="ex: 5" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Responsável</label>
                  <div className="relative">
                    <input 
                      name="responsible"
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-900 dark:text-white" 
                      placeholder="Nome completo" 
                    />
                  </div>
                </div>

                {showModal === 'use' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Justificação/Motivo</label>
                    <textarea 
                      name="reason"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-slate-900 dark:text-white resize-none" 
                      placeholder="Por que razão estas toalhas estão a ser registadas?" 
                      rows={3}
                    />
                  </div>
                )}

                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                  <span>Confirmar</span>
                  <CheckCircle2 size={20} />
                </button>

                <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                  <Info className="text-orange-500" size={16} />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    Esta ação irá atualizar o inventário em tempo real para o local selecionado imediatamente.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LocationRow({ name, percentage, color }: { name: string, percentage: number, color: string }) {
  const colors = {
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colors[color as keyof typeof colors])}
        />
      </div>
    </div>
  );
}

function InventoryCard({ title, image, quantity, location, status, color }: { title: string, image: string, quantity: number, location: string, status: string, color: string }) {
  const statusColors = {
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    slate: "text-slate-600 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400"
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3">
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm", statusColors[color as keyof typeof statusColors])}>
            {status}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <User size={12} className="opacity-70" />
            {location}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Quantidade</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{quantity}</p>
          </div>
          <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        active 
          ? "bg-orange-500/10 text-orange-500 font-bold" 
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-colors",
        active ? "text-orange-500" : "text-slate-400"
      )}
    >
      <Icon size={24} fill={active ? "currentColor" : "none"} />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color, tag, className }: { label: string, value: number, icon: LucideIcon, color: string, tag: string, className?: string }) {
  const colorClasses = {
    emerald: "border-emerald-200 dark:border-emerald-900/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    orange: "border-orange-200 dark:border-orange-900/30 text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    blue: "border-blue-200 dark:border-blue-900/30 text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    slate: "border-slate-200 dark:border-slate-800 text-slate-600 bg-slate-50 dark:bg-slate-800/50"
  };

  return (
    <div className={cn("flex flex-col gap-2 rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <Icon className={cn("text-xl", colorClasses[color as keyof typeof colorClasses].split(' ')[1])} size={20} />
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", colorClasses[color as keyof typeof colorClasses])}>
          {tag}
        </span>
      </div>
      <p className="text-slate-500 text-xs font-medium">{label}</p>
      <p className="text-slate-900 dark:text-white text-2xl lg:text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

interface ActivityItemProps {
  trx: Transaction;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ trx }) => {
  const isPositive = trx.type === 'LAUNDRY_RECEIVE' || (trx.type === 'TRANSFER' && trx.category === 'Academia');
  
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "size-10 rounded-full flex items-center justify-center",
          isPositive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
        )}>
          {trx.type === 'LAUNDRY_RECEIVE' ? <CheckCircle2 size={18} /> : trx.type === 'LAUNDRY_SEND' ? <Truck size={18} /> : <Package size={18} />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{trx.description}</p>
          <p className="text-xs text-slate-500">{format(trx.timestamp, "HH:mm '•' dd MMM", { locale: ptBR })}</p>
        </div>
      </div>
      <span className={cn("font-bold text-sm", isPositive ? "text-emerald-500" : "text-orange-500")}>
        {isPositive ? '+' : '-'}{trx.amount}
      </span>
    </div>
  );
};

function ThresholdSlider({ label, value, onChange, color }: { label: string, value: number, onChange: (v: number) => void, color: 'emerald' | 'orange' | 'blue' }) {
  const colors = {
    emerald: "accent-emerald-500 text-emerald-600 bg-emerald-50",
    orange: "accent-orange-500 text-orange-600 bg-orange-50",
    blue: "accent-blue-500 text-blue-600 bg-blue-50"
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-xl flex items-center justify-center", colors[color])}>
            {color === 'emerald' ? <CheckCircle2 size={20} /> : color === 'orange' ? <TrendingUp size={20} /> : <Truck size={20} />}
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{label}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-baseline gap-1">
          <span className={cn("font-bold text-lg", colors[color].split(' ')[1])}>{value}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">MÍN.</span>
        </div>
      </div>
      <div className="space-y-3">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn("w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer", colors[color].split(' ')[0])}
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>0</span>
          <span className="text-slate-300 dark:text-slate-600">Limite Mínimo</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
