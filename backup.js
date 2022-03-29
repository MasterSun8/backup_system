const fs = require('fs-extra')
const AdmZip = require('adm-zip')

const etc = `/etc`
const home = `/home`
const db = `/db`

const dest = `/tmp/tempbackup`
const backup = `/backup`

var logger = fs.createWriteStream('/var/log/kopiaZapasowa.txt', {flags: 'a'})
var writeLine = (line) => logger.write(`${line}\n`);

const etcFile = backup + `/etc` + todayDate('m') + `.zip`
const homeFile = backup + `/home` + todayDate('w') + `.zip`
const dbFile = backup + `/db` + todayDate() + `.zip`

let len = 0

let back = fs.readdirSync(backup)

function getWeek(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7))
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    return weekNo+1
}

function todayDate(range='d', today='t'){
    today = today == 't' ? new Date() : new Date(today)



    if(today instanceof Date){
        let y = today.getMonth() < 10 ? '-0' : '-'

        let x = today.getFullYear()

        x += range == 'w' ? '-w' + getWeek(today) : range == 'd'  ? y + today.getMonth() + '-' + today.getDate() : y + today.getMonth()

        return x
    }
    return ''
}

function createZipArchive(file) {
    try {
        const zip = new AdmZip()
        zip.addLocalFolder(dest)
        zip.writeZip(file)
        len = fs.readdirSync(dest).length
        writeLine(`Created ${file} successfully with ${len} files on ${todayDate()}`)
    } catch (error) {
        console.log(error)
    }
}

function isSameWeek(date){
    date = new Date(date)
    return !(back.includes(`/etc` + todayDate('m', date) + `.zip`))
}

function isSameDay(date){
    date = new Date(date)
    return !(back.includes(`/db` + todayDate('d', date) + `.zip`))
}

function isSameMonth(date){
    date = new Date(date)
    return !(back.includes(`/home` + todayDate('w', date) + `.zip`))
}

const filterFuncMonth = (source, destination) => {
    let y = fs.statSync((source))
    return isSameMonth(y.ctime)
}
const filterFuncWeek = (source, destination) => {
    let y = fs.statSync((source))
    return isSameWeek(y.ctime)
}
const filterFuncDay = (source, destination) => {
    let y = fs.statSync((source))
    return isSameDay(y.ctime)
}

try{
    fs.copySync(etc, dest, { filter: filterFuncMonth})
}catch (error) {
    writeLine("access to some files in etc denied: " + todayDate())
}

if(!(back.includes(etcFile))){
    createZipArchive(etcFile)
}else{
    writeLine("no need for another etc backup: " + todayDate())
}

let files = fs.readdirSync(dest)

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})

try{
    fs.copySync(home, dest, { filter: filterFuncWeek})
}catch (error) {
    writeLine("access to some files in home denied: "  + todayDate())
}

if(!(back.includes(homeFile))){
    createZipArchive(homeFile)
}else{
    writeLine("no need for another home backup: "  + todayDate())
}

files = fs.readdirSync(dest)

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})

try{
    fs.copySync(db, dest, { filter: filterFuncDay})
}catch (error) {
    writeLine("access to db denied: "  + todayDate())
}

if(!(back.includes(dbFile))){
    createZipArchive(dbFile)
}else{
    writeLine("no need for another db backup: "  + todayDate())
}

files = fs.readdirSync(dest)

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})