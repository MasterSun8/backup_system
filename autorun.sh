#!/bin/sh
pwd=$(pwd)
pwd+="/backup.sh"
crontab -l | { cat; echo "@reboot $pwd"; } | crontab -