

export default function CategoryCard({ item, onChoosingCategoryFunc, onOpenSearchingFunc }) {
    return <>
        <div className="w-full">
            <input type="radio" name="selected-category" value={item.value} id={item.id} className="hidden peer" onChange={onChoosingCategoryFunc} />
            <label htmlFor={item.id} onClick={onOpenSearchingFunc} className="block peer-checked:bg-violet-500 peer-checked:text-white group rounded-3xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:bg-red-300">

                <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    {/* <GrFormPrevious
                    size={18}
                    className="text-violet-500 transition group-hover:translate-x-1"
                /> */}
                </div>
            </label>
        </div>

    </>;
}
