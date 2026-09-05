#!/bin/bash
# 本番DBを手動でローカルにdumpする（定期実行はしない）
set -euo pipefail

cd "$(dirname "$0")/.."

set -a
source .env.production
set +a

mkdir -p backups
timestamp=$(date +%Y%m%d%H%M%S)
file="backups/albatross-${timestamp}.dump"

pg_dump --dbname="$DATABASE_URL" -f "$file"

echo "Saved to $file"
