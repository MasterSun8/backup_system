const fs = require('fs-extra');
const AdmZip = require("adm-zip");

const outputFile = dest+`\\backup.zip`;

async function createZipArchive() {
    try {
        const zip = new AdmZip();
        zip.addLocalFolder(dest);
        zip.writeZip(outputFile);
        console.log(`Created ${outputFile} successfully`);
    } catch (e) {
        console.log(`Something went wrong. ${e}`);
    }
}

function isTodayDate(date, range='d'){
    let x = new Date()
    date = new Date(date)
    if (date instanceof Date) {
        if(x.getFullYear() > date.getFullYear()){
            return false
        }else if(x.getMonth() > date.getMonth()){
            return false
        }else if(x.getDate() > date.getDate()){
            if(range=='m'){
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

const src = process.cwd();
const dest = `F:\\temp`;

fs.removeSync(dest+'\\'+`backup.zip`)

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