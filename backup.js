const fs = require('fs-extra')
const AdmZip = require("adm-zip")

const etc = `/etc`
const home = `/home`
const db = `/db`

const dest = `/tmp/tempbackup`
const backup = `/backup`

const today = new Date()

const etcFile = backup + `/etc` + todayDate('m') + `.zip`
const homeFile = backup + `/home` + todayDate('w') + `.zip`
const dbFile = backup + `/db` + todayDate() + `.zip`

function getWeek(date) {
    var onejan = new Date(date.getFullYear(),0,1);
    var millisecsInDay = 86400000;
    return Math.ceil((((this - onejan) /millisecsInDay) + onejan.getDay()+1)/7);
};

function todayDate(range='d'){
    let y = '-'
    if(today instanceof Date){
        if(today.getMonth() < 10) y += '0'
        let x = today.getFullYear() + y + today.getMonth()
        switch (range) {
            case 'd':
                x += '-' + today.getDate()
                break
            case 'w':
                x += '-w' + getWeek(today)
                break
        }
        return x
    }
    return ''
}

async function createZipArchive() {
    try {
        const zip = new AdmZip()
        zip.addLocalFolder(dest)
        zip.writeZip(etcFile)
        console.log(`Created ${etcFile} successfully`)
    } catch (error) {
        //console.error(error)
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

function isSameWeek(date){
    date = new Date(date)
}

function isSameDay(){

}

function isSameMonth(){

}

let back = fs.readdirSync(backup)

const filterFuncMonth = (source, destination) => {
    let y = fs.statSync((source))
    return isSameMonth(y.ctime, 'm')
}
const filterFuncWeek = (source, destination) => {
    let y = fs.statSync((source))
    return isSameWeek(y.ctime, 'm')
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

try{
    fs.copySync(home, dest, { filter: filterFuncWeek})
}catch (error) {
    //console.error(error)
}

try{
    fs.copySync(db, dest, { filter: filterFuncDay})
}catch (error) {
    //console.error(error)
}

let sr = fs.readdirSync(etc)
let files = fs.readdirSync(dest)

console.log(sr)
console.log(files)
console.log(back)

if(!(back.includes(etcFile))){
    createZipArchive()}
else{
    console.log("no need for another backup")
}

if(!(back.includes(homeFile))){
    createZipArchive()}
else{
    console.log("no need for another backup")
}

if(!(back.includes(dbFile))){createZipArchive()
}else{
    console.log("no need for another backup")
}

files.forEach(x => {
    fs.removeSync(dest+'\\'+x)
})