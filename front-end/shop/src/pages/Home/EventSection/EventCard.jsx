import Badge from "../../Global/Bagde/Bagde";
import {getEventBadgeValue, getImgPath} from "../../../util";

export default function EventCard({ item, eventId, onClickFunc }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm min-w-sm">
      {/* <div className="h-44 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500" /> */}
      <img src={getImgPath(item.image)} alt="" className="object-fill w-full" />
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
        <div className="inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">
          <span>Mức ưu đãi: {item.discount}%</span>
          
        </div>
        <div className="space-y-1 text-sm text-slate-600">
          <p>Từ: {item.startAt}</p>
          <p>Tới: {item.endAt}</p>
        </div>
        <div id={eventId} className="flex items-center justify-between gap-3 pt-1">
          <Badge value={getEventBadgeValue(item.startAt, item.endAt)}></Badge>
          <button onClick={onClickFunc} className="text-sm font-semibold text-violet-700 hover:underline">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}