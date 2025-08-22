#!/bin/sh
set -e
URL="${WAIT_URL:-http://frontend:3000/}"
RETRIES="${WAIT_RETRIES:-180}"
INTERVAL="${WAIT_INTERVAL:-2}"

echo "Waiting for $URL ..."
i=0
while ! curl -fsS --max-time 2 "$URL" >/dev/null; do
  i=$((i+1))
  if [ "$i" -ge "$RETRIES" ]; then
    echo "Timeout waiting for $URL" >&2
    exit 1
  fi
  sleep "$INTERVAL"
done
echo "Frontend is UP."
# exit 0 – leis nginx entrypoint'ui tęsti startą
