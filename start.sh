#!/usr/bin/env bash
# Siteyi 8080 portunda yayınlar (Codespaces portu otomatik yönlendirir).
#   ./start.sh            → site kapalıysa başlatır, açıksa haber verir
#   ./start.sh --restart  → çalışan siteyi durdurup yeniden başlatır
cd "$(dirname "$0")"
PORT="${PORT:-8080}"

port_in_use() {
  python3 -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1', $PORT)) == 0 else 1)"
}

if [ "$1" = "--restart" ] && port_in_use; then
  echo "Çalışan site durduruluyor (port $PORT)..."
  pkill -f "http.server $PORT" || true
  for _ in 1 2 3 4 5 6 7 8 9 10; do port_in_use || break; sleep 0.3; done
fi

if port_in_use; then
  echo "Site zaten çalışıyor: http://localhost:${PORT}"
  echo "(Codespace açılırken otomatik başlatılır. Yeniden başlatmak için: ./start.sh --restart)"
  exit 0
fi

echo "Site çalışıyor: http://localhost:${PORT}  (durdurmak için Ctrl+C)"
exec python3 -m http.server "$PORT"
