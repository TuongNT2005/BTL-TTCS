

export default function SectionHeader({ title, action = "Xem tất cả", actionFunc = ()=>{} }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
      <button onClick={actionFunc} className="text-sm font-semibold text-violet-700 hover:underline">
        {action}
      </button>
    </div>
  );
}