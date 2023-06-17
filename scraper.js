import request from 'request-promise';
import { load } from 'cheerio';

const data =[];
async function CollectData(job){
    const urls =[];
    const headers = {
        "accept": "text/html,application/xhtml+xml,application/text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=86400",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    };
    for(let i = 1; i <5; i++){
        let page = `https://www.shine.com/job-search/${job.replace(" ","-")}-jobs-${i}?q=${job.replace(" ","%20")}`;
        const response = await request({
            uri:page,
            header: headers,
            gzip: true,
        });
        let  $ = load(response);
        if($('div[class="jobCard_jobCard__jjUmu  white-box-border jobCard"]')[0]){
            $('div[class="jobCard_jobCard__jjUmu  white-box-border jobCard"]').each(function () {
                urls.push($(this).find('meta').attr('content'));
            });
        }
        else return -1;        
    }    

    for(let url of urls) {
        const response = await request({
            uri:url,
            header: headers,
            gzip: true,
        });
        let  $ = load(response);
        let jobSkills = "";
        $('ul[class="keyskills_keySkills_items__ej9_3"]').children().each(function(){
            jobSkills = jobSkills.concat($(this).text().concat(","));            
        })
        data.push(jobSkills);
    }
    console.log('data added');
    const output = countSkills(data);
    return output;
}

/*** Sorting ***/

function compare( a, b ) {
    if ( a.skillCount > b.skillCount ){
        return -1;
    }
    if ( a.skillCount < b.skillCount ){
        return 1;
    }
    return 0;
}

/*** Frequency count ***/

function countSkills(data){
    const op = [];
    var str = '';
    for(let item of data){
        str = str.concat(item);
    }
    const jobset = str.split(",");
    const map = jobset.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    map.forEach((value, key)=>{
        if(value>6){
            op.push({
                skill: key,
                skillCount: value,
            });
        }
    });
    const result = op.sort( compare );
    console.log(op);
    let count = 0;
    const final = [];
    for(let i=0; i<result.length; i++){
        count += 1;
        let skill = result[i].skill;
        final.push(skill);  
        if(count > 9) break;
    }
    return final;
}
export default CollectData;