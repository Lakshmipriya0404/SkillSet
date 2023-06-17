import info from './data.json' assert {type: 'json'};
import CollectData from "./scraper.js";
import { readFileSync, writeFileSync } from 'fs';

let stored = [];

/*** Storing data ***/

async function Collect(ip){
    const got = await CollectData(ip);
    if(got==-1){return [-1]}
    stored.push({
        title: ip,
        got,
    });
    let datajson = readFileSync("data.json","utf-8");
    if(datajson.length===0){
        console.log("No data")
        datajson = JSON.stringify(stored);
        writeFileSync("data.json",datajson,"utf-8");
    }
    else{
        console.log("Got data");
        let data = JSON.parse(datajson);
        for(let items of data){
            stored.push(items);
        }
        datajson = JSON.stringify(stored);
        writeFileSync("data.json",datajson,"utf-8");
    }
    return got;
}

/*** main function ***/

function main(ip) {
    var flag = false;
    for(let i of info){
        if(i.title === ip){
            console.log('correct');
            flag = true;
            return i.got;
        }
    }
    if(!flag){
        return Collect(ip);
    }
}
export default main;