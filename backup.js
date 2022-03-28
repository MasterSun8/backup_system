const fs = require('fs-extra')
const AdmZip = require("adm-zip")

const src = `/etc`
const dest = `/temp`

const today = new Date()

fs.ensureDirSync(`/backup`)

const outputFile = `/backup/etc` + todayDate('m') + `.zip`

console.log(outputFile)

function todayDate(range='d'){
    if(today instanceof Date){
        let x = today.getFullYear() + '-' + today.getMonth()
        if(range == 'd'){
            x += '-' + today.getDate()
        }
        return x
    }
    return ''
}

async function createZipArchive() {
    try {
        const zip = new AdmZip()
        zip.addLocalFolder(dest)
        zip.writeZip(outputFile)
        console.log(`Created ${outputFile} successfully`)
    } catch (e) {
        console.log(`Something went wrong. ${e}`)
    }
}

function isTodayDate(date, range='d'){
    let x = today
    date = new Date(date)
    if (date instanceof Date) {
        if(x.getFullYear() > date.getFullYear()){
            return false
        }else if(x.getMonth() > date.getMonth()){
            return false
        }else if(x.getDate() > date.getDate()){
            if(range!='d'){
                return true
            }else{
                return false
            }
        }else{
            return true
        }
    }else{
        console.log('not a date')
        return false
    }
}

const filterFunc = (source, destination) => {
    let y = fs.statSync((outputFile))
    return !(isTodayDate(y.ctime, 'm'))
}

fs.copySync(src, dest, { filter: filterFunc })

let sr = fs.readdirSync(src)
let files = fs.readdirSync(dest)

console.log(sr)
console.log(files)

createZipArchive()

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})