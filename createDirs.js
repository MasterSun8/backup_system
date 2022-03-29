const fs = require('fs-extra')
fs.ensureDirSync(`/var/log/kopiaZapasowa`)
fs.ensureDirSync(`/backup`)
fs.ensureDirSync(`/tmp/tempbackup`)