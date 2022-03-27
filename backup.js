const fs = require('fs-extra');

const src = `./test`;
const dest = `./testTarget`;

function writeDate(date){
    if (date instanceof Date) {
        let x = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear()
        return x
    }else{
        return console.log('not a date')
    }
}

function isNotToday(date){
    if (date instanceof Date) {
        let x = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear()
        return x
    }else{
        return console.log('not a date')
    }
}

fs.readdir(src, (err, files) => {
    if (err) return console.log(err)
    files.forEach(x => {
        fs.stat((src+'/'+x), (err, stats) => {
            if(err) return console.log(err)
            console.log(x + ` Data Last Modified: ${writeDate(stats.mtime)}`);
            console.log(x + ` Status Last Modified: ${writeDate(stats.ctime)}`);
        })
    })
})

/*const dir = fs.readdirSync(src).filter(file => {
    fs.stat((src+'/'+x), (err, stats) => {
        if(err) return console.log(err)
        return stats.ctime
    })
})

fs.copy(src, dest, err => {
    if (err) return console.error(err)
    console.log('success!')
})*/