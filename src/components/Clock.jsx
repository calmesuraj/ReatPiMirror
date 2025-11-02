import {useEffect, useState} from "react";

export default function Clock({use12h=true}) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const opts = { weekday:"long", month:"long", day:"numeric", year:"numeric" };
  const date = now.toLocaleDateString(undefined, opts);
  const hours = use12h ? ((now.getHours()+11)%12+1) : now.getHours();
  const mins = now.getMinutes().toString().padStart(2,"0");
  const secs = now.getSeconds().toString().padStart(2,"0");
  const ampm = use12h ? (now.getHours()>=12 ? "PM":"AM") : "";
  return (
    <div>
      <div className="text-3xl">{date}</div>
      <div className="text-6xl font-bold">
        {hours}:{mins}<span className="text-3xl align-top ml-2">{secs}</span>
        {use12h && <span className="text-2xl ml-2">{ampm}</span>}
      </div>
    </div>
  );
}
