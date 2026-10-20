#!/usr/bin/env bash
# Siteyi 8080 portunda yayınlar (Codespaces portu otomatik yönlendirir).
cd "$(dirname "$0")"
PORT="${PORT:-8080}"
echo "Site çalışıyor: http://localhost:${PORT}"
exec python3 -m http.server "$PORT"
