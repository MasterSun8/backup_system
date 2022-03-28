#!/bin/sh
activeDir=$(pwd)
activeDir="${activeDir}/backup.sh"
echo "$activeDir"
crontab -l | { cat; echo "@reboot $activeDir"; } | crontab -
crontab -l
