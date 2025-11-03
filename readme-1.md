# React Magic Mirror on Raspberry Pi

## Overview

A self-hosted, responsive Magic Mirror built with **React + Vite**, running on a **Raspberry Pi** using **Chromium in kiosk mode**. It includes clock, weather, and Google Calendar (ICS) integration.

---

## 1. System Requirements

* Raspberry Pi 4 or newer (2GB+ recommended)
* Raspberry Pi OS (Desktop mode)
* Node.js 20+ (Node 22 recommended)
* Chromium Browser
* VNC enabled (optional for remote access)

---

## 2. Setup Commands

```bash
sudo apt update
sudo apt install -y git curl unclutter chromium
sudo raspi-config
```

Enable:

* **Boot / Auto Login → Desktop / Autologin**
* **Interface Options → VNC → Enable**

---

## 3. Project Folder Structure

```
/home/karki/ReactMirror/ReatPiMirror/
├─ dist/                      # Build output
├─ public/                    # Static files
├─ src/
│   ├─ assets/                # Images
│   ├─ components/            # Clock.jsx, Weather.jsx, MonthGrid.jsx
│   ├─ lib/ics.js             # ICS parser
│   ├─ App.jsx, main.jsx, index.css
├─ server.mjs                 # Express proxy + static server
├─ vite.config.js             # Build config
└─ package.json
```

---

## 4. Environment Variables

Set your Google Calendar ICS URL:

```bash
ICS_URL="https://calendar.google.com/calendar/ical/your_email%40gmail.com/public/basic.ics"
```

---

## 5. Build and Run

```bash
cd /home/karki/ReactMirror/ReatPiMirror
npm install
npm run build
ICS_URL="<your_ics_url>" npm run start
```

Open: `http://localhost:8080`

---

## 6. Systemd Service: Backend

Create `/etc/systemd/system/reactmirror.service`:

```ini
[Unit]
Description=React MagicMirror App
After=network-online.target
Wants=network-online.target

[Service]
User=karki
WorkingDirectory=/home/karki/ReactMirror/ReatPiMirror
Environment=NODE_ENV=production
Environment=PORT=8080
Environment=ICS_URL=https://calendar.google.com/calendar/ical/anxu.katwal48%40gmail.com/public/basic.ics
ExecStart=/usr/local/bin/node /home/karki/ReactMirror/ReatPiMirror/server.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable reactmirror
sudo systemctl start reactmirror
sudo systemctl status reactmirror
```

---

## 7. Systemd Service: Kiosk Mode (Frontend)

`/etc/systemd/system/mirror-ui.service`

```ini
[Unit]
Description=Chromium Kiosk for React Mirror
After=reactmirror.service vncserver-x11-serviced.service graphical.target network-online.target
Wants=reactmirror.service vncserver-x11-serviced.service

[Service]
User=karki
Environment=DISPLAY=:0
Environment=XDG_RUNTIME_DIR=/run/user/1000
Environment=CHROME_USER_DATA=/home/karki/.config/chromium-mirror
ExecStart=/bin/bash -lc '\
  until curl -sf http://localhost:8080 >/dev/null; do sleep 1; done; \
  pkill -f "chromium --kiosk --app=http://localhost:8080" || true; \
  exec chromium \
    --kiosk \
    --noerrdialogs \
    --no-first-run \
    --disable-features=Translate,InfiniteSessionRestore \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --start-fullscreen \
    --incognito \
    --password-store=basic \
    --user-data-dir="$CHROME_USER_DATA" \
    --app=http://localhost:8080 \
'
Restart=on-failure
RestartSec=3

[Install]
WantedBy=graphical.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable mirror-ui
sudo systemctl start mirror-ui
```

---

## 8. Background Image Fix

To load a background image, place it in `src/assets/` and import it:

```jsx
import bg from './assets/IMG_9526-modified.JPG';
<div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }} />
```

---

## 9. Weather (Open-Meteo API)

No API key required.

```jsx
const url = "https://api.open-meteo.com/v1/forecast?latitude=32.814&longitude=-96.9489&current=temperature_2m";
```

---

## 10. VNC Fix Steps

If VNC fails after reboot:

```bash
sudo systemctl enable --now vncserver-x11-serviced
sudo systemctl status vncserver-x11-serviced
```

If kiosk prevents connection:

```bash
sudo systemctl disable --now mirror-ui
sudo reboot
```

Then reconnect, adjust service dependencies, and re-enable.

---

## 11. Logs & Troubleshooting

View logs:

```bash
sudo journalctl -u reactmirror -n 50 --no-pager
sudo journalctl -u mirror-ui -n 50 --no-pager
```

Common issues:

* **ICS HTML error** → wrong calendar link or HTML returned.
* **Weather 401** → wrong API key (use Open-Meteo).
* **Chromium repeats** → disable duplicate launcher (LXDE vs systemd).
* **VNC black screen** → ensure Desktop autologin is enabled.

---

## 12. Update Flow

```bash
cd /home/karki/ReactMirror/ReatPiMirror
git pull
npm run build
sudo systemctl restart reactmirror
sudo systemctl restart mirror-ui
```

---

## 13. Optional Improvements

* Convert to Electron for single-window operation.
* Add offline fallback page.
* Add voice/weather/news modules.

---

## 14. Quick Recovery Checklist

| Issue           | Symptom               | Fix                                          |
| --------------- | --------------------- | -------------------------------------------- |
| App not loading | Port 8080 unavailable | `sudo systemctl restart reactmirror`         |
| VNC fails       | Black screen          | Ensure autologin + `mirror-ui` waits for VNC |
| Chromium loops  | Multiple kiosks       | Disable LXDE autostart                       |
| Calendar blank  | ICS URL wrong         | Test link in browser                         |
| Weather stuck   | API error             | Use Open-Meteo                               |

---

**Final Notes:**

* Your app runs on boot via systemd.
* Full screen kiosk handled by Chromium.
* Calendar refreshes every 2 minutes.
* Weather updates automatically.
* Edit CSS in `src/index.css` or per-module component styling.

---

© 2025 Suraj Karki | Personal React Magic Mirror Project



## ==========================================
# React Magic Mirror on Raspberry Pi

## Overview

A self-hosted, responsive Magic Mirror built with **React + Vite**, running on a **Raspberry Pi** using **Chromium in kiosk mode**. It includes clock, weather, and Google Calendar (ICS) integration.

---

## 1. System Requirements

* Raspberry Pi 4 or newer (2GB+ recommended)
* Raspberry Pi OS (Desktop mode)
* Node.js 20+ (Node 22 recommended)
* Chromium Browser
* VNC enabled (optional for remote access)

---

## 2. Setup Commands

```bash
sudo apt update
sudo apt install -y git curl unclutter chromium
sudo raspi-config
```

Enable:

* **Boot / Auto Login → Desktop / Autologin**
* **Interface Options → VNC → Enable**

---

## 3. Project Folder Structure

```
/home/karki/ReactMirror/ReatPiMirror/
├─ dist/                      # Build output
├─ public/                    # Static files
├─ src/
│   ├─ assets/                # Images
│   ├─ components/            # Clock.jsx, Weather.jsx, MonthGrid.jsx
│   ├─ lib/ics.js             # ICS parser
│   ├─ App.jsx, main.jsx, index.css
├─ server.mjs                 # Express proxy + static server
├─ vite.config.js             # Build config
└─ package.json
```

---

## 4. Environment Variables

Set your Google Calendar ICS URL:

```bash
ICS_URL="https://calendar.google.com/calendar/ical/your_email%40gmail.com/public/basic.ics"
```

---

## 5. Build and Run

```bash
cd /home/karki/ReactMirror/ReatPiMirror
npm install
npm run build
ICS_URL="<your_ics_url>" npm run start
```

Open: `http://localhost:8080`

---

## 6. Systemd Service: Backend

Create `/etc/systemd/system/reactmirror.service`:

```ini
[Unit]
Description=React MagicMirror App
After=network-online.target
Wants=network-online.target

[Service]
User=karki
WorkingDirectory=/home/karki/ReactMirror/ReatPiMirror
Environment=NODE_ENV=production
Environment=PORT=8080
Environment=ICS_URL=https://calendar.google.com/calendar/ical/anxu.katwal48%40gmail.com/public/basic.ics
ExecStart=/usr/local/bin/node /home/karki/ReactMirror/ReatPiMirror/server.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable reactmirror
sudo systemctl start reactmirror
sudo systemctl status reactmirror
```

---

## 7. Systemd Service: Kiosk Mode (Frontend)

`/etc/systemd/system/mirror-ui.service`

```ini
[Unit]
Description=Chromium Kiosk for React Mirror
After=reactmirror.service vncserver-x11-serviced.service graphical.target network-online.target
Wants=reactmirror.service vncserver-x11-serviced.service

[Service]
User=karki
Environment=DISPLAY=:0
Environment=XDG_RUNTIME_DIR=/run/user/1000
Environment=CHROME_USER_DATA=/home/karki/.config/chromium-mirror
ExecStart=/bin/bash -lc '\
  until curl -sf http://localhost:8080 >/dev/null; do sleep 1; done; \
  pkill -f "chromium --kiosk --app=http://localhost:8080" || true; \
  exec chromium \
    --kiosk \
    --noerrdialogs \
    --no-first-run \
    --disable-features=Translate,InfiniteSessionRestore \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --start-fullscreen \
    --incognito \
    --password-store=basic \
    --user-data-dir="$CHROME_USER_DATA" \
    --app=http://localhost:8080 \
'
Restart=on-failure
RestartSec=3

[Install]
WantedBy=graphical.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable mirror-ui
sudo systemctl start mirror-ui
```

---

## 8. Background Image Fix

To load a background image, place it in `src/assets/` and import it:

```jsx
import bg from './assets/IMG_9526-modified.JPG';
<div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }} />
```

---

## 9. Weather (Open-Meteo API)

No API key required.

```jsx
const url = "https://api.open-meteo.com/v1/forecast?latitude=32.814&longitude=-96.9489&current=temperature_2m";
```

---

## 10. VNC Fix Steps

If VNC fails after reboot:

```bash
sudo systemctl enable --now vncserver-x11-serviced
sudo systemctl status vncserver-x11-serviced
```

If kiosk prevents connection:

```bash
sudo systemctl disable --now mirror-ui
sudo reboot
```

Then reconnect, adjust service dependencies, and re-enable.

---

## 11. Logs & Troubleshooting

View logs:

```bash
sudo journalctl -u reactmirror -n 50 --no-pager
sudo journalctl -u mirror-ui -n 50 --no-pager
```

Common issues:

* **ICS HTML error** → wrong calendar link or HTML returned.
* **Weather 401** → wrong API key (use Open-Meteo).
* **Chromium repeats** → disable duplicate launcher (LXDE vs systemd).
* **VNC black screen** → ensure Desktop autologin is enabled.

---

## 12. Update Flow

```bash
cd /home/karki/ReactMirror/ReatPiMirror
git pull
npm run build
sudo systemctl restart reactmirror
sudo systemctl restart mirror-ui
```

---

## 13. Optional Improvements

* Convert to Electron for single-window operation.
* Add offline fallback page.
* Add voice/weather/news modules.

---

## 14. Quick Recovery Checklist

| Issue           | Symptom               | Fix                                          |
| --------------- | --------------------- | -------------------------------------------- |
| App not loading | Port 8080 unavailable | `sudo systemctl restart reactmirror`         |
| VNC fails       | Black screen          | Ensure autologin + `mirror-ui` waits for VNC |
| Chromium loops  | Multiple kiosks       | Disable LXDE autostart                       |
| Calendar blank  | ICS URL wrong         | Test link in browser                         |
| Weather stuck   | API error             | Use Open-Meteo                               |

---

**Final Notes:**

* Your app runs on boot via systemd.
* Full screen kiosk handled by Chromium.
* Calendar refreshes every 2 minutes.
* Weather updates automatically.
* Edit CSS in `src/index.css` or per-module component styling.

---

© 2025 Suraj Karki | Personal React Magic Mirror Project

---

## 15. Editing and Updating After Deployment

### 1. Connect to the Raspberry Pi

Use SSH or VNC:

```bash
ssh <USER>@<pi-ip-address>
```

Or open a terminal on the Pi if you have a display connected.

---

### 2. Navigate to Your Project

```bash
cd /home/<USER>/ReactMirror/ReatPiMirror
```

---

### 3. Edit Files

You can edit files using:

* **Nano** in terminal:

  ```bash
  nano src/App.jsx
  ```
* **VS Code (via VNC):**

  ```bash
  code .
  ```
* **WinSCP or File Transfer:**
  From another computer, open `/home/<USER>/ReactMirror/ReatPiMirror` and replace/update files.

---

### 4. Rebuild the App

After editing React source files:

```bash
npm run build
```

This compiles the updated code into the `dist/` directory.

---

### 5. Restart Services

Restart the backend server:

```bash
sudo systemctl restart reactmirror
```

Restart the kiosk display if needed:

```bash
sudo systemctl restart mirror-ui
```

---

### 6. Verify Application

Check if both services are running:

```bash
sudo systemctl status reactmirror
sudo systemctl status mirror-ui
```

Or visit:

```
http://localhost:8080
```

---

### 7. Debugging Logs

If something goes wrong:

```bash
sudo journalctl -u reactmirror -n 50 --no-pager
sudo journalctl -u mirror-ui -n 50 --no-pager
```

---

### 8. Temporarily Disable Kiosk Mode

If you want to stop Chromium from auto-launching while editing:

```bash
sudo systemctl stop mirror-ui
```

Then re-enable when done:

```bash
sudo systemctl start mirror-ui
```

---

### ✅ Typical Workflow Summary

1. SSH into Pi
2. `cd /home/<USER>/ReactMirror/ReatPiMirror`
3. Edit code in `src/`
4. `npm run build`
5. `sudo systemctl restart reactmirror`
6. Confirm at `http://localhost:8080`

---

This section ensures you can quickly edit and redeploy your **React MagicMirror** without reinstalling or reconfiguring the Pi setup.
