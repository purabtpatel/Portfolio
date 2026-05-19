#!/bin/bash
set -e

cd "$(dirname "$0")/Client"
npm run build
sudo cp -r dist/* /var/www/html/
sudo systemctl reload nginx
echo "Deployed."
