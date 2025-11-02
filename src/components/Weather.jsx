import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

const LAT = 32.8140;
const LON = -96.9489;

// °C → °F
const cToF = (c) => Math.round((c * 9) / 5 + 32);

const codeToIcon = (code) => {
  if ([0].includes(code)) return "☀️";
  if ([1,2,3].includes(code)) return "⛅";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,56,57].includes(code)) return "🌦️";
  if ([61,63,65,66,67,80,81,82].includes(code)) return "🌧️";
  if ([71,73,75,77,85,86].includes(code)) return "❄️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
};

export default function Weather() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setState({ status: "loading" });

        const params = {
          latitude: LAT,
          longitude: LON,
          current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
          daily: "weather_code,temperature_2m_max,temperature_2m_min",
          timezone: "auto",
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        const responses = await fetchWeatherApi(url, params);
        const res = responses[0];

        // --- CURRENT ---
        const cur = res.current();
        const curr = {
          tempC: cur.variables(0).value(),
          rh: cur.variables(1).value(),
          feelsC: cur.variables(2).value(),
          code: cur.variables(3).value(),
        };

        // --- DAILY (ensure Numbers, not BigInt) ---
        const daily = res.daily();

        const timeStart = Number(daily.time());         // unix seconds
        const timeEnd   = Number(daily.timeEnd());      // unix seconds
        const interval  = Number(daily.interval());     // seconds between entries
        const utcOffset = Number(res.utcOffsetSeconds());

        const steps = Math.max(0, Math.floor((timeEnd - timeStart) / interval));
        const dates = Array.from({ length: steps }, (_, i) =>
          new Date((timeStart + i * interval + utcOffset) * 1000)
        );

        const toArr = (idx) => Array.from(daily.variables(idx).valuesArray());
        const wCode = toArr(0);   // weather_code
        const tMaxC = toArr(1);   // temperature_2m_max
        const tMinC = toArr(2);   // temperature_2m_min

        const forecast = dates.slice(0, 5).map((date, i) => ({
          date,
          code: wCode[i],
          maxF: cToF(tMaxC[i]),
          minF: cToF(tMinC[i]),
        }));

        if (!alive) return;
        setState({
          status: "ok",
          current: {
            tempF: cToF(curr.tempC),
            feelsF: cToF(curr.feelsC),
            rh: Math.round(curr.rh),
            code: curr.code,
          },
          forecast,
        });
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setState({ status: "error", message: e?.message || "Weather failed" });
      }
    }

    load();
    const id = setInterval(load, 2 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (state.status === "loading") {
    return <div className="weather opacity-80">Loading weather…</div>;
  }
  if (state.status === "error") {
    return (
      <div className="weather text-red-300">
        Weather unavailable: <span className="opacity-80">{state.message}</span>
      </div>
    );
  }

  const { current, forecast } = state;
  return (
    <div className="weather text-right">
      <div className="text-2xl font-semibold">{current.tempF}°F</div>
      <div className="opacity-80 text-sm">
        Feels {current.feelsF}° • RH {current.rh}%
      </div>

      <div className="mt-2 grid grid-cols-5 gap-2 text-center text-sm">
        {forecast.map((x, i) => (
          <div key={i} className="bg-white/5 rounded p-2">
            <div>{x.date.toLocaleDateString(undefined, { weekday: "short" })}</div>
            <div className="text-xl">{codeToIcon(x.code)}</div>
            <div className="text-sm font-bold">{x.maxF}°</div>
            <div className="text-xs opacity-80">/ {x.minF}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
