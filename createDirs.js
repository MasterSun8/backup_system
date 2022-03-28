const fs = require('fs-extra')
fs.ensureDirSync(`/backup`)
fs.ensureDirSync(`/var/log`)
fs.ensureDirSync(`/temp`)