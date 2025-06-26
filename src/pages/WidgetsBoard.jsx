import { useState } from 'react';
import WidgetCard from '../components/WidgetCard';
import AddWidgetButton from '../components/AddWidgetButton';
import { Truck, Users, Clock } from 'lucide-react';

const INITIAL_WIDGETS = [
  { id: 1, title: 'Taux de livraison à temps', value: '72%', icon: <Truck /> },
  { id: 2, title: 'Fournisseurs actifs', value: '60%', icon: <Users /> },
  { id: 3, title: 'Taux de livraison à temps', value: '25%', icon: <Truck /> },
  { id: 4, title: 'Délai moyen de livraison', value: '48h', icon: <Clock /> },
];

export default function WidgetsBoard() {
  const [widgets, setWidgets] = useState(INITIAL_WIDGETS);

  const handleAdd = () => {
    const newId = widgets.length + 1;
    setWidgets([
      ...widgets,
      { id: newId, title: `Nouveau KPI #${newId}`, value: '0%', icon: <Clock /> },
    ]);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex gap-6 flex-wrap">
        {widgets.map(w => (
          <WidgetCard key={w.id} {...w} />
        ))}
        <AddWidgetButton onClick={handleAdd} />
      </div>

      <div className=" max-w-md mx-auto bg-gray-300 text-center
                      text-sm py-2 rounded">
        Veuillez cliquer sur le bouton « + » pour afficher les KPI
      </div>
    </section>
  );
}
