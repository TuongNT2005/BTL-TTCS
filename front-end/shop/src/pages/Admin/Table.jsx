import { cn } from "../../util";

export default function Table({ columns, rows, className }) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-violet-100", className)}>
      <div className="relative flex-1 overflow-auto hide-scrollbar">
        <table className="min-w-full text-left border-separate border-spacing-0">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="sticky top-0 z-10 bg-violet-50 px-4 py-3 text-xs font-bold uppercase text-violet-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-violet-50 bg-white">
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  );
}