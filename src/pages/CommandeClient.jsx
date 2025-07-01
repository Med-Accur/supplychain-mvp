
import MainLayout from '../components/MainLayout';
import WidgetsBoard from './WidgetsBoard';

export default function CommandeClient() {
  return (
    <MainLayout>
      <h2 className="text-2xl font-semibold mb-6">KPIs — Commande Client</h2>
      <WidgetsBoard />
    </MainLayout>
  );
}
