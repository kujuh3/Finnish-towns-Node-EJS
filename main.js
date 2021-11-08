const express = require("express");

const app = express();

const fs = require("fs");

app.set("views", "./views");
app.set("view engine", "ejs");

const portti = 3104;

let tiedot = [];
let maarat = [];

function maara(arr, key){
    //array määriä varten
    let array = [];
    arr.forEach((x)=>{
       
    //jos määriä varten tehdyssä arrayssä on keytä vastaava arvo niin nostetaan määrää +1
     if(array.some((val)=>{ return val[key] == x[key] })){
        array.forEach((k)=>{
         if(k[key] === x[key]){ 
           k["Maara"]++
         }
      })
     }else{
       //jos ei niin tehdään uusi objekti nykyisen iteraation key arvolla ja asetetaan määräksi 1
       let a = {}
       a[key] = x[key]
       a["Maara"] = 1
       array.push(a);
     }
  })
  return array
}

//haetaan json tiedosto, parsitaan ase ja haetaan määrät listaa varten
fs.readFile("./model/kunnat.json", "utf-8", (err, data) => {
    if (err) throw err;

    tiedot = JSON.parse(data);
    //määrät ja nimet arrayyn maakunta listaa varten
    maarat = maara(tiedot, "Maakunta");
});

app.use(express.static("./public"));

//id parametrinä tuleva rajattavan nimi jonka perusteella lähetys clientille
app.get("/rajaus/:id", (req, res) => {
    
    let otsikko = req.params.id;
    let imgsrc = "src=/img/" + otsikko + ".png";
    let button = "Näytä vain kaupungit"
    let action = "action=/rajaus/" + otsikko + "/kaupungit"
    let filter = false;

    console.log(req)

    //En ole varma miten kuvat sai hakea, joten yritin tätä tapaa ensin..
    //res.sendFile("/imgs/" + otsikko + ".png");
    res.render("rajaus", { "otsikko" : otsikko, "tiedot" : tiedot, "button" : button, "action" : action, "maarat" : maarat, "imgsrc" : imgsrc, "filter" : filter });
});

//Jos rajataan kaupunkeja tietystä maakunnasta 
app.get("/rajaus/:id/kaupungit", (req, res) => {
    
    let otsikko = req.params.id;
    let imgsrc = "src=/img/" + otsikko + ".png";
    let button = "Näytä kaikki"
    let action = "action=/rajaus/" + otsikko
    let filter = true;

    //En ole varma miten kuvat sai hakea, joten yritin tätä tapaa ensin..
    //res.sendFile("/imgs/" + otsikko + ".png");
    res.render("rajaus", { "otsikko" : otsikko, "tiedot" : tiedot, "button" : button, "action" : action, "maarat" : maarat, "imgsrc" : imgsrc, "filter" : filter });
});

//vakio index
app.get("/", (req, res) => {

    let otsikko = "Kaikki";
    let button = "Näytä vain kaupungit"
    let action = "action=/kaupungit"

    res.render("index", { "tiedot" : tiedot, "otsikko" : otsikko, "action" : action, "button" : button, "maarat" : maarat });
});

//kaikKi maakunnat kaupunkirajauksella
app.get("/kaupungit", (req, res) => {
    
    let otsikko = "Kaupungit"
    let button = "Näytä kaikki"
    let action = 'action=/'

    res.render("kaupungit", { "tiedot" : tiedot, "otsikko" : otsikko, "button" : button, "action" : action, "maarat" : maarat });
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttin: ${portti}`);
});