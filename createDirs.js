const fs = require('fs-extra')
fs.ensureDirSync(`/backup`)
fs.ensureDirSync(`/tmp/tempbackup`)
console.log('works')