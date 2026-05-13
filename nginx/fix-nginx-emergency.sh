#!/usr/bin/env bash
set -e
sudo rm -f /etc/nginx/sites-enabled/teamcontrolcenter-site
sudo rm -f /etc/nginx/sites-enabled/teamcontrolcenter-app
sudo rm -f /etc/nginx/sites-enabled/teamcontrolcenter-api
sudo nginx -t
sudo systemctl reload nginx
