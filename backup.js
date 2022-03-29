const fs = require('fs-extra')
const child_process = require("child_process");

const etc = `/etc`
const home = `/home`
const db = `/db`

const dest = `/tmp/tempbackup`
const backup = `/backup`
const etcDest = dest + etc
const homeDest = dest + home
const dbDest = dest + db

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

function createZipArchive(file, destination) {
    try {
        child_process.execSync(`zip -r ${file} *`, {
            cwd: destination
        })
        len = fs.readdirSync(destination).length
        child_process.execSync(`sudo rm -r ${destination}/*`)
        writeLine(`Created ${file} successfully with ${len} files on ${todayDate()}`)
    } catch (error) {
        writeLine(error)
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
    fs.copySync(etc, etcDest, { filter: filterFuncMonth})
}catch (error) {
    writeLine("access to some files in etc denied: " + todayDate())
}

if(back.includes(etcFile)){
    createZipArchive(etcFile, etcDest)
}else{
    writeLine("no need for another etc backup: " + todayDate())
}

try{
    fs.copySync(home, homeDest, { filter: filterFuncWeek})
}catch (error) {
    writeLine("access to some files in home denied: "  + todayDate())
}

if(back.includes(homeFile)){
    createZipArchive(homeFile, homeDest)
}else{
    writeLine("no need for another home backup: "  + todayDate())
}

try{
    fs.copySync(db, dbDest, { filter: filterFuncDay})
}catch (error) {
    writeLine("access to db denied: "  + todayDate())
}

if(back.includes(dbFile)){
    createZipArchive(dbFile, dbDest)
}else{
    writeLine("no need for another db backup: "  + todayDate())
}