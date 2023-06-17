import main from "./index.js";
import express from "express";
import bodyParser from "body-parser";

let allSkills = [];
let input ='';

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) =>{
    res.render('home',{
        Title: input,
        Disclaimer: "",
        allData: allSkills
    });
    input='';
    allSkills = [];
});

app.post('/', async(req, res) =>{
    input = req.body.jobTitle;
    if(input=="") return res.redirect('/');
    allSkills = await main(input);
    if(allSkills[0]==-1){
        allSkills=[];
        return res.render('home',{
            Title:"NO DATA FOUND",
            Disclaimer:"Please verify your spellings or broaden your search criteria",
            allData: allSkills
        });
    }
    console.log(allSkills);
    res.redirect('/');
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});