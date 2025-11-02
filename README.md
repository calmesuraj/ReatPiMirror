# React Mirror (MagicMirror-style)

A minimal React app that reproduces the MagicMirror layout: clock, weather, month grid, and an upcoming events list. Built with Vite + Tailwind.

## 1) Install

```bash
npm install
```

Copy `.env.example` to `.env` and set values:
```
VITE_OPENWEATHER_KEY=YOUR_OPENWEATHERMAP_API_KEY
VITE_LAT=32.8140
VITE_LON=-96.9489
VITE_CAL_ICS=https://calendar.google.com/calendar/ical/.../basic.ics
```

## 2) Dev (with ICS proxy)
```bash
npm run dev
```
- The dev server proxies `/ics` to your `VITE_CAL_ICS` URL to bypass CORS.
- Open http://localhost:5173

## 3) Build & preview
```bash
npm run build
npm run preview   # serves on http://localhost:8080
```

## 4) Deploy on Raspberry Pi

```bash
# copy repo to Pi
npm install
npm run build

# simplest static server
npm i -g serve
serve -s dist -l 8080
```

Then launch Chromium in kiosk mode pointed to `http://localhost:8080`.

## 5) Nginx or Node proxy for ICS in production

You need to proxy your ICS because Google Calendar ICS doesn't send CORS headers.

### Nginx snippet
```
location /ics {
  proxy_pass https://calendar.google.com/calendar/ical/your.../basic.ics;
}
```

### Node/Express (tiny)
```js
import express from 'express'
import fetch from 'node-fetch'
const app = express()
app.get('/ics', async (req,res)=>{
  const r = await fetch(process.env.VITE_CAL_ICS)
  const txt = await r.text()
  res.setHeader('Access-Control-Allow-Origin','*')
  res.type('text/calendar').send(txt)
})
app.listen(8081)
```

Point the React app to `/ics` at that proxy.

## 6) Customize

- Background image: put a file `public/bg.jpg`.
- Fonts/colors: edit `src/index.css` and Tailwind classes.
- Update intervals: components poll every **2 minutes** by default.
