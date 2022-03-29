const fs = require('fs-extra')
const AdmZip = require("adm-zip")

const etc = `/etc`
const home = `/home`
const db = `/db`

const dest = `/tmp/tempbackup`
const backup = `/backup`

const etcFile = backup + `/etc` + todayDate('m') + `.zip`
const homeFile = backup + `/home` + todayDate('w') + `.zip`
const dbFile = backup + `/db` + todayDate() + `.zip`


let back = fs.readdirSync(backup)
console.log(back)

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

async function createZipArchive(file) {
    try {
        const zip = new AdmZip()
        zip.addLocalFolder(dest)
        zip.writeZip(file)
        console.log(`Created ${file} successfully`)
    } catch (error) {
        //console.error(error)
    }
}

function isSameWeek(date){
    date = new Date(date)
    return back.includes(`/etc` + todayDate('m', date) + `.zip`)
}

function isSameDay(date){
    date = new Date(date)
    return back.includes(`/db` + todayDate('m', date) + `.zip`)
}

function isSameMonth(){

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
    return isSameDay(y.ctime, 'm')
}

try{
    fs.copySync(etc, dest, { filter: filterFuncMonth})
}catch (error) {
    //console.error(error)
}

let sr = fs.readdirSync(etc)
let files = fs.readdirSync(dest)

console.log(files)

if(back.includes(etcFile)){
    createZipArchive(etcFile)}
else{
    console.log("no need for another backup")
}

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})

try{
    fs.copySync(home, dest, { filter: filterFuncWeek})
}catch (error) {
    //console.error(error)
}

if(back.includes(homeFile)){
    createZipArchive(homeFile)}
else{
    console.log("no need for another backup")
}

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})

try{
    fs.copySync(db, dest, { filter: filterFuncDay})
}catch (error) {
    //console.error(error)
}

if(back.includes(dbFile)){
    createZipArchive(dbFile)
}else{
    console.log("no need for another backup")
}

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})