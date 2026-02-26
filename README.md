# 🌸 Okinawa Diaries

A personal holiday showcase website — a Cinnamoroll-themed scrapbook of photos, videos, and locations from Okinawa, Japan.

Built as a surprise gift. ✨

---

## Project Structure

```
okinawa-diaries/
  backend/    ← Node.js + Express + SQLite API
  frontend/   ← React + Vite + Tailwind CSS
```

---

## Quick Start (Local Development)

### 1. Clone / open the project

```bash
cd "d:/Coding Projects/JillSurprise"
```

### 2. Set up the backend

```bash
cd backend
npm install

# Copy the example env file and fill in your password
cp .env.example .env
# Edit .env and set ADMIN_PASSWORD=something-secret

# Seed the database with 3 beautiful placeholder entries
npm run seed

# Start the dev server
npm run dev        # or: npm start
```

The backend runs on **http://localhost:3001**.

> **Windows note:** `better-sqlite3` v12 ships prebuilt binaries for Node ≥ 18. If `npm install` still fails (older Node / ARM), install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) with the "Desktop development with C++" workload and re-run `npm install`.

---

### 3. Set up the frontend

```bash
cd frontend
npm install

# (Optional) copy env example — leave VITE_API_URL blank for local dev
cp .env.example .env

# Start Vite dev server
npm run dev
```

The frontend runs on **http://localhost:5173**.
Vite proxies `/api` and `/uploads` to `localhost:3001` automatically — no CORS hassle.

---

## Admin Panel

Go to **http://localhost:5173/admin** and enter the `ADMIN_PASSWORD` you set in `backend/.env`.

From the admin panel you can:
- Drag & drop photos or videos to upload them
- Fill in caption, location name, GPS coordinates, category, and date
- Delete any existing entry

---

## Environment Variables

### `backend/.env`

| Variable         | Default                    | Description                              |
|------------------|----------------------------|------------------------------------------|
| `PORT`           | `3001`                     | Port the Express server listens on       |
| `ADMIN_PASSWORD` | *(required)*               | Password for the admin panel             |
| `FRONTEND_URL`   | `http://localhost:5173`    | CORS allow-list origin for production    |

### `frontend/.env`

| Variable        | Default | Description                                                      |
|-----------------|---------|------------------------------------------------------------------|
| `VITE_API_URL`  | *(empty)* | Backend URL. Leave empty in dev (uses Vite proxy). Set to your Railway/Render URL in production. |

---

## Deploying to Production

### Backend → Railway (or Render)

1. Push the `backend/` folder to a GitHub repository (or as a sub-path).
2. Create a new Railway project → **Deploy from GitHub repo**.
3. Set environment variables in the Railway dashboard:
   - `ADMIN_PASSWORD` = your secret
   - `FRONTEND_URL` = your Vercel frontend URL (added after deploying frontend)
4. Railway will auto-detect Node.js and run `npm start`.
5. Note the public URL Railway assigns (e.g. `https://okinawa-diaries-backend.up.railway.app`).

> **Important:** Railway's ephemeral filesystem means uploaded files are lost on redeploy. For a permanent solution, consider replacing the `/uploads` folder with an S3 bucket (multer-s3) or Cloudinary. For a personal, low-traffic site Railway is fine as long as you don't redeploy too often.

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub.
2. Import the repo in Vercel → set **Root Directory** to `frontend`.
3. Add an environment variable:
   - `VITE_API_URL` = the Railway backend URL from above.
4. Deploy. Vercel will run `npm run build` and serve the `dist/` folder.

---

## Customising the "About" message

Open [frontend/src/components/AboutSection.jsx](frontend/src/components/AboutSection.jsx) and edit the text inside the `<p>` tags in the message block — it's clearly marked with a comment.

---

## Tech Stack

| Layer      | Tech                                   |
|------------|----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3         |
| Map        | Leaflet + react-leaflet (CartoDB tiles)|
| Gallery    | react-masonry-css                      |
| Backend    | Node.js, Express 4                     |
| Database   | SQLite via better-sqlite3              |
| File store | Local `/uploads` folder (static)       |
| Fonts      | Google Fonts — Dancing Script + Nunito |

---

## API Reference

| Method | Path                | Auth? | Description                  |
|--------|---------------------|-------|------------------------------|
| `POST` | `/api/auth`         | No    | Verify admin password        |
| `GET`  | `/api/entries`      | No    | List all entries (date desc) |
| `POST` | `/api/entries`      | Yes   | Upload new entry             |
| `DELETE` | `/api/entries/:id` | Yes  | Delete entry + its file      |
| `GET`  | `/uploads/:file`    | No    | Serve media file             |

Auth uses `Authorization: Bearer <ADMIN_PASSWORD>` header.

---

Made with 💕 as a surprise gift · Okinawa Diaries 🌸
