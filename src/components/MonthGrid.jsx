import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { parseIcs } from "../lib/ics";

export default function MonthGrid() {
  const [events, setEvents] = useState([]);
  const [monthStart, setMonthStart] = useState(dayjs().startOf("month"));

  useEffect(() => {
    async function load() {
      const { data } = await axios.get("/ics"); // dev proxy
      setEvents(parseIcs(data));
    }
    load();
    const id = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const weeks = useMemo(() => {
    const start = monthStart.startOf("week"); // Sunday
    const end = monthStart.endOf("month").endOf("week");
    const days = [];
    let d = start;
    while (d.isBefore(end) || d.isSame(end)) {
      days.push(d);
      d = d.add(1, "day");
    }
    const byDay = days.map((date) => {
      const list = events.filter((e) => dayjs(e.start).isSame(date, "day"));
      return { date, list };
    });
    const chunks = [];
    for (let i = 0; i < byDay.length; i += 7) chunks.push(byDay.slice(i, i + 7));
    return chunks;
  }, [events, monthStart]);

  return (
    <div className="month-grid">
      <div className="text-center text-2xl font-semibold mb-3">
        {monthStart.format("MMMM YYYY")}
      </div>

      {/* weekday header – weekends red */}
      <div className="grid grid-cols-7 gap-2 text-sm mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <div
            key={d}
            className={`text-center uppercase tracking-wide ${i === 0 || i === 6 ? "text-red-400" : "text-white/80"
              }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* month body */}
      <div className="grid grid-rows-6 gap-2">
        {weeks.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 gap-2">
            {row.map(({ date, list }) => {
              const isToday = date.isSame(dayjs(), "day");
              const isCurrentMonth = date.isSame(monthStart, "month");
              const isWeekend = date.day() === 0 || date.day() === 6;

              // backgrounds
              const cellBg = isCurrentMonth
                ? "bg-white/10"      // current month
                : "bg-gray-700/40";  // NOT current month -> gray out

              const cellBorder = isToday
                ? "border-cyan-400"
                : "border-white/15";

              return (
                <div
                  key={date.toString()}
                  data-current-month={isCurrentMonth ? "yes" : "no"}
                  className={`rounded-lg p-2 min-h-24 border ${cellBg} ${cellBorder}`}
                >
                  <div
                    className={`flex justify-between items-center mb-1 ${isToday ? "text-cyan-300 font-bold" : ""
                      }`}
                  >
                    <span
                      className={`text-base font-semibold ${isWeekend ? "text-red-400" : "text-white"
                        }`}
                    >
                      {date.date()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {list.slice(0, 4).map((ev) => (
                      <div
                        key={ev.uid + ev.start}
                        className="text-xs leading-snug bg-red-600/70 text-white rounded-md px-2 py-1"
                      >
                        <span className="font-bold">
                          {dayjs(ev.start).format("h:mm A")}
                        </span>{" "}
                        <span className="break-words">{ev.title}</span>
                      </div>
                    ))}

                    {list.length > 4 && (
                      <div className="text-xs text-white/60">
                        +{list.length - 4} more…
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
