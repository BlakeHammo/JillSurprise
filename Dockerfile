FROM node:20-alpine

# Build tools needed for better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++

WORKDIR /app

# ── Frontend: install deps + build ────────────────────────────────────────────
COPY frontend/package*.json ./frontend/
RUN npm install --prefix frontend

COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# ── Backend: install deps ──────────────────────────────────────────────────────
COPY backend/package*.json ./backend/
RUN npm install --prefix backend

COPY backend/ ./backend/

EXPOSE 3001

CMD ["node", "backend/server.js"]
