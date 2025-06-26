import { Plus } from 'lucide-react';

export default function AddWidgetButton({ onClick }) {
  return (
    <div className='mt-35'>
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-gray-200 flex items-center
                 justify-center hover:bg-gray-300 transition">
      <Plus size={18} />
    </button>
    </div>
  );
}
