import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {parseIcs, daysUntil} from "../lib/ics";

export default function Upcoming() {
  const [events,setEvents]=useState([]);

  useEffect(()=>{
    async function load(){
      const {data} = await axios.get("/ics");
      const evs = parseIcs(data);
      const future = evs.filter(e => dayjs(e.end).isAfter(dayjs()));
      setEvents(future.slice(0,10));
    }
    load();
    const id = setInterval(load, 2*60*1000); // 2 min
    return () => clearInterval(id);
  },[]);

  return (
    <div>
      <h2 className="uppercase text-xs tracking-wide mb-2 border-b border-white/30 pb-1">
        Upcoming Events
      </h2>
      <div className="space-y-2">
        {events.map(e=>(
          <div key={e.uid+e.start} className="flex gap-3 items-baseline text-xs">
            <div className="w-28 font-bold">{dayjs(e.start).format("ddd, MMM D")}</div>
            <div className="w-28 font-semibold">{e.allDay ? "All day" : `${dayjs(e.start).format("h:mm A")}–${dayjs(e.end).format("h:mm A")}`}</div>
            <div className="flex-1 break-words">{e.title}</div>
            <div className="text-white/70 text-xs">{daysUntil(e.start)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
