import { cn } from "../../util";

export default function Card({ title, children, action, className="" }) {
  return (
    <section className={cn("rounded-[28px] border border-violet-100 p-5 shadow-sm sm:p-6 bg-white", className)}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}