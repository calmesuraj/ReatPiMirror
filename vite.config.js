import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a dev proxy so your ICS can be fetched despite CORS.
// Set VITE_CAL_ICS in .env (full ICS URL). In dev, you'll fetch /ics.
export default defineConfig({
  plugins: [react()],
 server: {
  proxy: {
    '/ics': {
      target: 'https://calendar.google.com/calendar/ical/anxu.katwal48%40gmail.com/public/basic.ics',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => ''
    }
  }
}

})
