

export default function Badge({ value }) {

    const statusClasses = {
        ACTIVE: "bg-emerald-100 text-emerald-700",
        ACCEPTED: "bg-emerald-100 text-emerald-700",
        AVALIBLE: "bg-emerald-100 text-emerald-700",
        PENDING: "bg-amber-100 text-amber-700",
        COMING: "bg-sky-100 text-sky-700",
        DONE: "bg-violet-100 text-violet-700",
        REJECTED: "bg-rose-100 text-rose-700",
        UNAVALIBLE: "bg-red-100 text-red-700",
        PAID: "bg-green-100 text-green-700",
        CANCEL: "bg-orange-100 text-orange-700",
        EXPRIED: "bg-red-100 text-red-700",
        DELIVERIED: "bg-green-100 text-green-700",
    };

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[value] || "bg-slate-100 text-slate-700"}`}>{value}</span>;
}