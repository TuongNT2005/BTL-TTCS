import "./loading.css"

export default function Loading() {
    return <div className="w-full h-full bg-black/80">
        <div className="w-20 aspect-square rounded-full bg-white flex items-center justify-center relative overflow-hidden m-auto">
            <div className="w-7/8 aspect-square  rounded-full bg-black z-10"></div>
            <div id="loading"></div>
        </div>
        <p className="font-bold">Loading...</p>
    </div>
}