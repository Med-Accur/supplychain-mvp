import { Truck } from 'lucide-react';

export default function WidgetCard({ title, value, icon = <Truck /> }) {
  return (
    <div className="w-52 h-32 bg-white rounded-2xl shadow-lg
                    flex flex-col items-center justify-center gap-1">
      <span className="text-xs font-bold">{title}</span>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-gray-400">{icon}</span>
    </div>
  );
}
