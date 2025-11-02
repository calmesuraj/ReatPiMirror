import Clock from "./components/Clock.jsx";
import Weather from "./components/Weather.jsx";
import MonthGrid from "./components/MonthGrid.jsx";
import Upcoming from "./components/Upcoming.jsx";

export default function App() {
  return (
    <div className="h-screen w-screen overflow-hidden p-4 lg:p-6 grid 
                    grid-cols-3 gap-4 lg:gap-6 
                    grid-rows-[auto_minmax(0,1fr)_minmax(0,0.45fr)]">

      {/* Top row */}
      <div className="col-span-3 lg:col-span-1">
        <Clock />
      </div>

      <div className="col-span-3 lg:col-span-1 flex items-start justify-center">
        <h1 className="text-[clamp(14px,2.2vw,24px)] font-semibold uppercase tracking-wide">
          Calendar
        </h1>
      </div>

      <div className="col-span-3 lg:col-span-1">
        <Weather />
      </div>

      {/* Middle row (Month grid area) */}
      
      <div className="col-span-3 min-h-0 flex items-stretch justify-center overflow-hidden grid-calender">
        <style>{`.grid-calender { align-items: center;margin-bottom:-197px;margin-top:-72px}`}</style>
        {/* This box scales/shrinks the month grid to always fit */}
        <div className="max-w-6xl w-full h-full overflow-hidden">
          <MonthGrid />
        </div>
      </div>

      {/* Bottom row (Upcoming) */}
      <div className="col-span-3 min-h-0 upcoming-events">
        <style>{`.upcoming-events { align-items: center; margin-top:135px}`}</style>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-full">
          {/* Upcoming takes left column; auto-shrinks text via CSS below */}
          <div className="min-h-0 h-full overflow-hidden">
            <Upcoming />
          </div>
          <div className="hidden lg:block" />
          <div className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
