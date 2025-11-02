import ICAL from "ical.js";
import dayjs from "dayjs";

export function parseIcs(text) {
  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents("vevent") || [];
  const events = vevents.map(v => {
    const e = new ICAL.Event(v);
    return {
      uid: e.uid,
      title: e.summary || "",
      start: e.startDate.toJSDate(),
      end: e.endDate.toJSDate(),
      allDay: e.startDate.isDate,
      location: e.location || ""
    };
  });
  events.sort((a,b)=>a.start-b.start);
  return events;
}

export function daysUntil(d) {
  const diff = dayjs(d).startOf('day').diff(dayjs().startOf('day'), 'day');
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1)  return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}
