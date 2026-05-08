import { getImgPath, cn } from "../../util";

export default function ProductCard({ item, productId, onClickFunc, className="" }) {
  return (
    <div className={cn("group overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl min-w-40 md:min-w-xs flex flex-col justify-betweenx", className)}>
      <div className="aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={getImgPath(item.image)}
          alt={item.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div id={productId} className="space-y-2 p-4">
        <h3 className="font-semibold text-slate-900">{item.name}</h3>
        <p className="text-sm text-slate-500">{item.category}</p>
        <button onClick={onClickFunc} className="mt-2 w-full rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}