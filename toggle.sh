#!/bin/bash

STATUS=$(systemctl is-active cloudflared)

if [ "$STATUS" = "active" ]; then
    sudo systemctl stop cloudflared nginx
    echo "Portfolio stopped."
else
    sudo systemctl start nginx cloudflared
    echo "Portfolio started."
fi
