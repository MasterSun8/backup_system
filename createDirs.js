const fs = require('fs-extra')
fs.ensureDirSync(`/backup`)
fs.ensureDirSync(`/tmp/tempbackup`)
fs.ensureDirSync(`/var/log`)