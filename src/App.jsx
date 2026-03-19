import React, { useState, useEffect } from 'react';
import {
  WashingMachine,
  Dumbbell,
  Package,
  Trash2,
  Plus,
  ArrowRightLeft,
  Send,
  Download,
  History,
  User,
  AlertCircle,
  Trash,
} from 'lucide-react';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  addDoc,
  collection,
} from 'firebase/firestore';

import { auth, db, appId, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from './firebase';
import DashboardCard from './components/DashboardCard';
import ActionButton from './components/ActionButton';
import HistoryTable from './components/HistoryTable';
import MovementModal from './components/MovementModal';
import './index.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({ stock: 20, gym: 6, dirty: 6, laundry: 10 });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', max: 0, requiresResponsible: false });
  const [formData, setFormData] = useState({ amount: 1, responsible: '', origin: 'stock' });

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Erro de autenticação:', error);
      }
    };

    init();
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    const countsRef = doc(db, 'artifacts', appId, 'public', 'data', 'counts', 'main');
    const historyRef = collection(db, 'artifacts', appId, 'public', 'data', 'history');

    getDoc(countsRef)
      .then((snap) => {
        if (!snap.exists()) {
          return setDoc(countsRef, { stock: 20, gym: 6, dirty: 6, laundry: 10 });
        }
      })
      .catch((err) => console.error(err));

    const unsubCounts = onSnapshot(countsRef, (snap) => {
      if (snap.exists()) {
        setCounts(snap.data());
      }
    }, (err) => console.error('Erro counts:', err));

    const unsubHistory = onSnapshot(historyRef, (snap) => {
      const data = [];
      snap.forEach((docItem) => data.push({ id: docItem.id, ...docItem.data() }));
      data.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(data.slice(0, 50));
      setIsLoading(false);
    }, (err) => {
      console.error('Erro history:', err);
      setIsLoading(false);
    });

    return () => {
      unsubCounts();
      unsubHistory();
    };
  }, [user]);

  const totalTowels = counts.stock + counts.gym + counts.dirty + counts.laundry;

  const openModal = (type, title, max, requiresResponsible = false) => {
    setModal({ isOpen: true, type, title, max, requiresResponsible });
    setFormData({ amount: 1, responsible: '', origin: 'stock' });
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleConfirm = async (event) => {
    event.preventDefault();
    const amount = parseInt(formData.amount, 10);
    const responsible = formData.responsible.trim();
    const origin = formData.origin;

    if (Number.isNaN(amount) || amount <= 0) return;
    if (modal.max > 0 && amount > modal.max) return;
    if (modal.requiresResponsible && !responsible) return;

    const nextCounts = { ...counts };
    let actionLabel = '';

    switch (modal.type) {
      case 'to_gym':
        nextCounts.stock -= amount;
        nextCounts.gym += amount;
        actionLabel = 'Abasteceu Academia';
        break;
      case 'to_dirty':
        nextCounts.gym -= amount;
        nextCounts.dirty += amount;
        actionLabel = 'Recolheu Sujas da Academia';
        break;
      case 'to_laundry':
        nextCounts.dirty -= amount;
        nextCounts.laundry += amount;
        actionLabel = 'Enviou para Lavanderia';
        break;
      case 'from_laundry':
        nextCounts.laundry -= amount;
        nextCounts.stock += amount;
        actionLabel = 'Recebeu da Lavanderia';
        break;
      case 'add':
        nextCounts.stock += amount;
        actionLabel = 'Nova(s) toalha(s) comprada(s)';
        break;
      case 'discard':
        nextCounts[origin] -= amount;
        actionLabel = `Descartou toalha(s) (${origin === 'stock' ? 'Estoque' : origin === 'gym' ? 'Academia' : origin === 'dirty' ? 'Sujas' : 'Lavanderia'})`;
        break;
      default:
        return;
    }

    setCounts(nextCounts);
    closeModal();

    if (!user) return;

    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'counts', 'main'), nextCounts);
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'history'), {
        date: new Date().toLocaleString('pt-BR'),
        action: actionLabel,
        amount,
        responsible: responsible || 'Sistema',
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao salvar no Banco:', error);
    }
  };

  const handleDeleteHistory = async (id) => {
    if (!window.confirm('Deseja realmente apagar este registro?')) return;
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'history', id));
    } catch (error) {
      console.error('Erro ao deletar histórico:', error);
    }
  };

  return (
    <div className="app-shell">
      <div className="card-grid">
        <header className="header-top">
          <div>
            <h1 className="title"><Package className="icon" />Controle de Toalhas</h1>
            <p className="subtitle">Gestão de uso e lavanderia do condomínio</p>
          </div>
          <div className="stat-block">
            <span className="stat-label">Total Patrimônio</span>
            <span className="stat-value">{totalTowels} toalhas</span>
          </div>
        </header>

        <section className="dashboard-box">
          <DashboardCard title="Estoque Limpas" count={counts.stock} icon={<Package size={24} />} color="card-blue" />
          <DashboardCard title="Na Academia" count={counts.gym} icon={<Dumbbell size={24} />} color="card-green" />
          <DashboardCard title="Cesto (Sujas)" count={counts.dirty} icon={<AlertCircle size={24} />} color="card-amber" />
          <DashboardCard title="Na Lavanderia" count={counts.laundry} icon={<WashingMachine size={24} />} color="card-purple" />
        </section>

        <section className="panel">
          <div className="panel-header"><ArrowRightLeft size={20} /> Movimentações</div>
          <div className="actions-grid">
            <ActionButton title="Abastecer Academia" desc="Estoque → Academia" icon={<Dumbbell size={18} />} onClick={() => openModal('to_gym', 'Abastecer Academia', counts.stock)} disabled={counts.stock === 0} variant="default" />
            <ActionButton title="Recolher Sujas" desc="Academia → Cesto" icon={<AlertCircle size={18} />} onClick={() => openModal('to_dirty', 'Recolher Sujas da Academia', counts.gym)} disabled={counts.gym === 0} variant="default" />
            <ActionButton title="Enviar p/ Lavanderia" desc="Cesto → Lavanderia" icon={<Send size={18} />} onClick={() => openModal('to_laundry', 'Enviar para Lavanderia', counts.dirty, true)} disabled={counts.dirty === 0} variant="primary" />
            <ActionButton title="Receber da Lavanderia" desc="Lavanderia → Estoque" icon={<Download size={18} />} onClick={() => openModal('from_laundry', 'Receber da Lavanderia', counts.laundry, true)} disabled={counts.laundry === 0} variant="primary" />
            <ActionButton title="Comprar Nova" desc="+1 Estoque" icon={<Plus size={18} />} onClick={() => openModal('add', 'Adicionar Nova Toalha', 0)} variant="success" />
            <ActionButton title="Descartar Toalha" desc="-1 Patrimônio" icon={<Trash2 size={18} />} onClick={() => openModal('discard', 'Descartar Toalha Velha', totalTowels)} disabled={totalTowels === 0} variant="danger" />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><History size={20} /> Histórico Recente</div>
          <HistoryTable history={history} isLoading={isLoading} onDelete={handleDeleteHistory} />
        </section>
      </div>

      {modal.isOpen && (
        <MovementModal modal={modal} formData={formData} setFormData={setFormData} onConfirm={handleConfirm} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;

