

export default function WidgetCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#D6D6D6] bg-[#F9FAFB] p-5 shadow-sm md:p-6">
  <div className="flex items-center justify-center w-12 h-12 bg-[#f0eee9] rounded-xl">
    <div className="text-[#A79882] size-6">{icon}</div>
  </div>
  <div className="flex items-end justify-between mt-5">
    <div>
      <span className="text-sm text-gray-500">{title}</span>
      <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{value}</h4>
    </div>
  </div>
</div>
  );
}
