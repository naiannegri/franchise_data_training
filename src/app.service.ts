import { ConsoleLogger, Injectable, OnModuleInit } from '@nestjs/common';
import exportFromJSON from 'export-from-json'


//const puppeteer = require('puppeteer')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AppService implements OnModuleInit
 {
  private browser;
  private page;
  private specificPage;
  
  async onModuleInit(){
    await this.connect();
  }
  async openBrowser() {
    this.page = await this.browser.newPage();
    await this.page.goto('https://www.portaldofranchising.com.br/');
    await this.page.waitForSelector('#form');
    const texts = await this.page.$$eval('#form option', divs => divs.map(({ value }) => value));
    this.specificPage = await this.browser.newPage();
    texts.length = 17;
    texts.shift();
    let allNames = [];
    let allLinks = [];
    let allSectors = [];
    let allLogosLink = [];
    let allDescription = [];
    let allValues = [];
    const arrayAll = [{}];
    for (var prop in texts) {
        await this.specificPage.goto(texts[prop]);
        await new Promise(resolve => { setTimeout(resolve, 20000); });
        let companiesName = await this.specificPage.$$eval('.card-title', divs => divs.map(({ innerText }) => innerText));
        let companiesSector = await this.specificPage.$$eval('.main-title', divs => divs.map(({ innerText }) => innerText));
        let linkCompanies = await this.specificPage.$$eval('.card-body a', divs => divs.map(({ href }) => href));
        await this.specificPage.waitForSelector(".franquia-container-image");
        let logoLink = await this.specificPage.$$eval('.franquia-container-image img[src]', imgs => imgs.map(img => img.getAttribute('src')));
        let descriptions = await this.specificPage.$$eval('.card-text', divs => divs.map(({ innerText }) => innerText));
        let values = await this.specificPage.$$eval('.investment-values', divs => divs.map(({ innerText }) => innerText));
        await allSectors.push(companiesSector);
        await allLogosLink.push(logoLink);
        await allNames.push(companiesName);
        await allLinks.push(linkCompanies);
        await allDescription.push(descriptions);
        await allValues.push(values);
    }
    let splitRange = [];
    allNames = await allNames.filter(items => items);
    allLinks = await allLinks.filter(items => items);
    allDescription = await allDescription.filter(items => items);
    allValues = await allValues.filter(items => items);
    allLogosLink = await allLogosLink.filter(items => items);
    for (var i = 0; i < allNames.length; i++) {
        let attSectors = allSectors[i][0];
        let attLinks = await allLinks[i].filter(items => items);
        let attNames = await allNames[i].filter(items => items);
        let attDescription = await allDescription[i].filter(items => items);
        let attValues = await allValues[i].filter(items => items);
        let attLogosLink = await allLogosLink[i].filter(items => items);
        attNames = await [...new Set(attNames)];
        attLinks = await [...new Set(attLinks)];
        attDescription = await [...new Set(attDescription)];
        attValues = await [...new Set(attValues)];
        attLogosLink = await [...new Set(attLogosLink)];
        for (var j = 0; j < attNames.length; j++) {
            try {
                splitRange = attValues[j].split("a");
                console.log(splitRange.length);
                arrayAll.push({
                    "company": attNames[j],
                    "sector": attSectors,
                    "imageUrl": attLogosLink[j],
                    "pageUrl": attLinks[j],
                    "Description": attDescription[j],
                    "investmentStart": splitRange[0],
                    "investmentEnd": splitRange[1]
                });
            }
            catch (e) { }
            ;
            if (splitRange.length <= 1) {
                arrayAll.push({
                    "company": attNames[j],
                    "sector": attSectors,
                    "imageUrl": attLogosLink[j],
                    "pageUrl": attLinks[j],
                    "Description": attDescription[j],
                    "totalInvestment": attValues[j]
                });
            }
        }
        splitRange = [];
    }
    ;
    var data = JSON.stringify(arrayAll);
    var fs = require('fs');
    fs.writeFile('user.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    return "teste";
}
   async getDetails(){
    this.page = await this.browser.newPage();
    let allNewData = []
    let profile = ""
    const allData = require('../data.json');
    allNewData.push(allData)
    for(var i = 0; i < allData.length; i++){

        let pageUrl = allData[i].pageUrl;
        await this.page.goto(pageUrl);
        await this.page.setDefaultNavigationTimeout(0); 

        let textInvestment = await this.page.$$eval('.p-title-default',
        divs => divs.map(({ innerText }) => innerText));
        if ((textInvestment[textInvestment.length - 1]) == "SELO DE EXCELÊNCIA EM FRANCHISING"){
          textInvestment.pop()
        }
        try {
        profile = await this.page.$eval(
        "#leftColMinisite > div > div > div:nth-child(1)",
        (el) => el.innerText);
        } catch (e) {}

       // console.log(textInvestment)
        let valueInvestment = await this.page.$$eval('.bold-default',
        divs => divs.map(({ innerText }) => innerText));

        // let profile = await this.page.$$eval('.section-info--guides p',
        // divs => divs.map(({ innerText }) => innerText));
       // console.log(value)

       // console.log(profile)

        //console.log(textInvestment,valueInvestment)
        // textInvestment = textInvestment.split(',');
        // valueInvestment = valueInvestment.split(',');

      //  console.log(textInvestment,valueInvestment)
        if (textInvestment.length == 4) {
          allNewData[0][i]['return'] = valueInvestment[1]
          allNewData[0][i]['totalUnits'] = valueInvestment[2]
          allNewData[0][i]['contact'] = valueInvestment[3]
          allNewData[0][i]['profile'] = profile
        }
        else if((textInvestment.length == 5)){
          allNewData[0][i]['return'] = valueInvestment[1]
          allNewData[0][i]['averageCompanyBilling'] = valueInvestment[2]
          allNewData[0][i]['totalUnits'] = valueInvestment[3]
          allNewData[0][i]['contact'] = valueInvestment[4]
          allNewData[0][i]['profile'] = profile
        }


       console.log(allNewData)

    }
    var data = JSON.stringify(allNewData);
    var fs = require('fs');
    fs.writeFile('newData.json', data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });
  return "Look your json file"

    // const fileName = 'abfData'
    // const exportType =  exportFromJSON.types.csv 
     
    // exportFromJSON({ data, fileName, exportType })
    //   console.log("JSON data is saved.");

    // this.page = await this.browser.newPage();
    // await this.page.goto('https://www.portaldofranchising.com.br/')
    // await this.page.waitForSelector('#form')
   }

   
  async getCompanyDetails(){
    let allData = [];
    const getData = require('../newDataTest.json');
    allData.push(getData);
    for(var i = 0; i < getData.length; i++){
      try {
      let profile = allData[0][i].profile;
      let sector = allData[0][i].sector;
      console.log(profile)
      if(sector == "Franquias Home Based"){
        allData[0][i]['workStyle'] = "Home"
      }
      else if (sector == "Franquias em Quiosque" || profile.indexOf('loja') | profile.indexOf('lojas') | profile.indexOf('Loja') | profile.indexOf('Lojas')   ){
        allData[0][i]['workStyle'] = "In loco"
      }
    } catch(e){}
    }
    console.log(allData)
    var data = JSON.stringify(allData);
    var fs = require('fs');
    fs.writeFile('data-workstyle.json', data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });
  return "Look your json file"
  }

  async filtering(){
    let filtered = []
    let companyCSV = []
    this.page = await this.browser.newPage();
    await this.page.goto('https://www.abfexpo.com.br/pt/lista-de-expositores.html');
    await this.page.setDefaultNavigationTimeout(0)

    let companies = await this.page.$$eval('.column',
    divs => divs.map(({ innerText }) => innerText));
    companies.splice(0,6)
    companies = companies[0].split('\n')

    const allData = require('../companies-more-data.json');

     for(var i = 0; i < allData.length; i++){
      companyCSV.push(allData[i].company)
     }

       for(var i = 0; i < allData.length; i++) {
        for(var j = 0; j < companies.length; j++){
          if ((allData[i].company).indexOf(companies[j]) > -1){
                 filtered.push(allData[i])
                }
        }
      }

      let sum = 0
      let companiesNotFound = []
      let notRepeated = []
      for(var i = 0; i < companies.length; i++) {
        for(var j = 0; j < allData.length; j++){
          if ((companies[i]).indexOf(allData[j].company) > -1){
              sum += 1
          }
        }
        if (sum == 0){
          companiesNotFound.push(companies[i])
        }
        sum = 0
      }
      console.log(companiesNotFound)

  const arrUniq = [...new Map(filtered.map(v => [v.company, v])).values()]
//  console.log(companies.length, companiesNotFound.length,arrUniq.length)
    // column col-sm-3
    var data = JSON.stringify(companies);
    var fs = require('fs');
    fs.writeFile('allCompanies.json', data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });
    }


   // PEGA DADOS DE CADASTRO ALTERNATIVO DO SITE DA ABF
//   async getMoreDataNecessary(){
//  //   const missingCompanies = require('../companiesMissing.json')
//  //   const presentCompanies = require('../data-filtered.json')
//     const allPresentData = require('../companiesAtt.json')
//     let companiesAtt = []
//     companiesAtt.push(allPresentData)
//    // console.log(companiesAtt[0][0])

//     let valueSearch = ""
//     this.page = await this.browser.newPage();
//     for(var i = 0; i < allPresentData.length; i++){
//       valueSearch = companiesAtt[0][i].company
//       await this.page.goto('https://franquias.portaldofranchising.com.br/busca');
//       await new Promise(resolve => {setTimeout(resolve, 1500)});

//       try{

//         await this.page.type("#franchise-results > div > div:nth-child(2) > div > div > input", `${valueSearch}`);
//         await this.page.keyboard.press("Enter");
//         await new Promise(resolve => {setTimeout(resolve, 1500)});
//         await this.page.click("#Empresas > div:nth-child(2) > ol > li > a > div")
//         await new Promise(resolve => {setTimeout(resolve, 15000)});
  
//         const pageUrl = await this.page.url();
  

//       let companiesInvestment = await this.page.$$eval('.non-advertiser-investment p',
//       divs => divs.map(({ innerText }) => innerText));
//       companiesInvestment = companiesInvestment[0].split('a partir de R$')

//       let companiesSector = await this.page.$$eval('body > div > div:nth-child(1) > div > div.col-xl-8.col-12.mt-5 > div:nth-child(4) > div > div > span:nth-child(2)',
//       divs => divs.map(({ innerText }) => innerText));

//       let companiesPageUrl = await this.page.$$eval('body > div > div:nth-child(1) > div > div.col-xl-8.col-12.mt-5 > div:nth-child(4) > div > div > span:nth-child(2)',
//       divs => divs.map(({ innerText }) => innerText));

//    //   console.log(pageUrl)

//       let totalUnits = await this.page.$$eval("body > div > div:nth-child(1) > div > div.col-xl-8.col-12.mt-5 > div.row.mt-4 > div.col-9 > div > div.non-advertiser-units > p > span",
//       divs => divs.map(({ innerText }) => innerText));

//       let contact = await this.page.$$eval("body > div > div:nth-child(1) > div > div.col-xl-8.col-12.mt-5 > div:nth-child(6) > div:nth-child(2) > div > p.non-advertiser-type-franchise.segment-content.mb-0",
//       divs => divs.map(({ innerText }) => innerText));

//       let profile = await this.page.$$eval("body > div > div.container.mt-5 > div.row.mt-2 > div > div > div",
//       divs => divs.map(({ innerText }) => innerText));

//       let site = await this.page.$$eval("body > div > div:nth-child(1) > div > div.col-xl-8.col-12.mt-5 > div:nth-child(6) > div:nth-child(2) > div > a:nth-child(4)",
//       divs => divs.map(({ href }) => href));

//       let state = await this.page.$$eval("body > div > div:nth-child(1) > div > div.col-xl-8.col-12.mt-5 > div.row.mt-4 > div > div > div.non-advertiser-headquarters > p",
//       divs => divs.map(({ innerText }) => innerText));
//       state = state[0].split('ESTADO SEDE ')


//       companiesAtt[0][i].push({
//       // "company": valueSearch, 
//       "state": state[1],
//       // "sector": companiesSector[0],
//       // "pageUrl": pageUrl,
//       // "Description":"",
//       // "investmentStart": companiesInvestment[1],
//       // "investmentEnd":"",
//       // "return":"",
//       // "averageCompanyBilling": "",
//       // "totalUnits": totalUnits[0],
//       // "contact":contact[0],
//       // "workStyle": "",
//       // "site": site[0],
//       // "perfilFranqueado": "",
//       // "seleção": "",
//       // "taxa": null
//     })
//   } catch(e){
//     console.log(valueSearch)
// } 


//   }
//   var data = JSON.stringify(companiesAtt);
//   var fs = require('fs');
//   fs.writeFile('companiesAtt.json', data, (err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("JSON data is saved.");
// });


 // }

async getMoreDataNecessary(){
//  const missingCompanies = require('../companiesMissing.json')
//  const presentCompanies = require('../data-filtered.json')
const allPresentData = require('../companiesAtt.json')
let companiesAtt = []
companiesAtt.push(allPresentData)
let valueSearch = ""
this.page = await this.browser.newPage();

for(var i = 0; i < allPresentData.length; i++){
  valueSearch = companiesAtt[0][i].company
  console.log(companiesAtt[0][i].company)
  await this.page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1")
  await this.page.goto('https://franchisingbook.com.br/franquias/');
  
  try{
    await this.page.type("#filtroNome", `${valueSearch}`, {delay: 20});
    await this.page.waitForTimeout(4000)
    await this.page.click("body > div.container > div.col-md-3 > div > div > form > div:nth-child(2) > div > span > button")
    await this.page.waitForTimeout(4000)
    await this.page.click("body > div.container > div.col-md-9 > div > div:nth-child(1) > div > div.franquiaLogo > a")
    await this.page.waitForTimeout(10000)

    const pageUrl = await this.page.url();
  let totalEmployers = await this.page.$$eval("#pagPrincipal > div:nth-child(2) > div:nth-child(5) > p",
  divs => divs.map(({ innerText }) => innerText));

  let totalArea = await this.page.$$eval("#pagPrincipal > div:nth-child(2) > div:nth-child(6) > p",
  divs => divs.map(({ innerText }) => innerText));

  let faturamentoMedio = await this.page.$$eval("#pagPrincipal > div:nth-child(4) > div:nth-child(2) > p:nth-child(1)",
  divs => divs.map(({ innerText }) => innerText));

  let tempoRetorno = await this.page.$$eval("#pagPrincipal > div:nth-child(4) > div:nth-child(2) > p:nth-child(2)",
  divs => divs.map(({ innerText }) => innerText));

  let capitalInstalacao = await this.page.$$eval("#pagPrincipal > div:nth-child(5) > div:nth-child(3) > p:nth-child(1)",
  divs => divs.map(({ innerText }) => innerText));

  let taxaFranquia = await this.page.$$eval("#pagPrincipal > div:nth-child(5) > div:nth-child(3) > p:nth-child(2)",
  divs => divs.map(({ innerText }) => innerText));

  let capitalGiro = await this.page.$$eval("#pagPrincipal > div:nth-child(5) > div:nth-child(3) > p:nth-child(3)",
  divs => divs.map(({ innerText }) => innerText));

  let taxaPropaganda = await this.page.$$eval("#pagPrincipal > div:nth-child(6) > div:nth-child(2) > p:nth-child(1)",
  divs => divs.map(({ innerText }) => innerText));

  let taxaRoyalties = await this.page.$$eval("#pagPrincipal > div:nth-child(6) > div:nth-child(2) > p:nth-child(2)",
  divs => divs.map(({ innerText }) => innerText));

  let beneficiosFranqueado = await this.page.$$eval("#pagPrincipal > div:nth-child(7)",
  divs => divs.map(({ innerText }) => innerText));

//   dataCompany = dataCompany.split("\n")
  console.log(totalEmployers[0],totalArea[0],faturamentoMedio[0],tempoRetorno[0],capitalInstalacao[0],taxaFranquia[0],taxaPropaganda[0],taxaRoyalties[0],beneficiosFranqueado[0])

  companiesAtt[0][i]["totalFuncionarios"] = totalEmployers[0]
  companiesAtt[0][i]["totalArea"] = totalArea[0]
  companiesAtt[0][i]["faturamentoMedio"] = faturamentoMedio[0]
  companiesAtt[0][i]["tempoRetorno"] = tempoRetorno[0]
  companiesAtt[0][i]["capitalInstalacao"] = capitalInstalacao[0]
  companiesAtt[0][i]["taxaFranquia"] = taxaFranquia[0]
  companiesAtt[0][i]["taxaPropaganda"] = taxaPropaganda[0]
  companiesAtt[0][i]["taxaRoyalties"] = taxaRoyalties[0]
  companiesAtt[0][i]["beneficiosFranqueado"] = beneficiosFranqueado[0]

} catch(e){
console.log(e)
console.log(valueSearch)
} 


}
var data = JSON.stringify(companiesAtt);
var fs = require('fs');
fs.writeFile('companiesAtt.json', data, (err) => {
if (err) {
    throw err;
}
console.log("JSON data is saved.");
})

//PEGA DADOS RECEITA
//   const allPresentData = require('../companiesAtt.json')
//   let companiesAtt = []
//   companiesAtt.push(allPresentData)
//   let valueSearch = ""
//   this.page = await this.browser.newPage();

//   for(var i = 0; i < allPresentData.length; i++){
//     valueSearch = companiesAtt[0][i].cnpj
//     console.log(companiesAtt[0][i].cnpj)
//     await this.page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1")
//     await this.page.goto('https://servicos.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp');
//     await this.page.waitForTimeout(20000)
    
//     try{

//       await this.page.type("#cnpj", `${valueSearch}`, {delay: 10});
//       await this.page.waitForTimeout(6500)
//     //  await this.page.click(document.querySelector("#frmConsulta > div:nth-child(4) > div > button.btn.btn-primary"))
//      // await new Promise(resolve => {setTimeout(resolve, 2500)});

//       const pageUrl = await this.page.url();

//     let sociedade = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(13) > tbody > tr > td > font:nth-child(3) > b",
//     divs => divs.map(({ innerText }) => innerText));
//  //   dataCompany = dataCompany.split("\n")

//     let situacao = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(23) > tbody > tr > td:nth-child(1) > font:nth-child(3) > b",
//     divs => divs.map(({ innerText }) => innerText));

//     // let municipio = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(17) > tbody > tr > td:nth-child(5) > font:nth-child(3) > b",
//     // divs => divs.map(({ innerText }) => innerText));

//     // let porte = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(7) > tbody > tr > td:nth-child(3) > font:nth-child(3) > b",
//     // divs => divs.map(({ innerText }) => innerText));

//     let dateSituation = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(23) > tbody > tr > td:nth-child(3) > font:nth-child(3) > b",
//     divs => divs.map(({ innerText }) => innerText));


//     let principalActivity = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(9) > tbody > tr > td > font:nth-child(3) > b",
//     divs => divs.map(({ innerText }) => innerText));

//     let secondaryActivity = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(11) > tbody > tr > td > font:nth-child(5) > b",
//     divs => divs.map(({ innerText }) => innerText));

//     let dateOpening = await this.page.$$eval("#principal > table:nth-child(1) > tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > font:nth-child(3) > b",
//     divs => divs.map(({ innerText }) => innerText));

//     console.log(dateOpening[0],principalActivity[0],secondaryActivity[0],situacao[0])
//    // companiesAtt[0][i]["city"] = municipio[0]
//     companiesAtt[0][i]["dateOfOpening"] = dateOpening[0]
//     // companiesAtt[0][i]["society"] = sociedade[0]
//     companiesAtt[0][i]["principalActivity"] = principalActivity[0]
//     companiesAtt[0][i]["secondaryActivity"] = secondaryActivity[0]
//     companiesAtt[0][i]["companyStatus"] = situacao[0]
//     companiesAtt[0][i]["dateOfStatus"] = dateSituation[0]
//     // companiesAtt[0][i]["companySize"] = porte[0]

// } catch(e){
//   console.log(e)
//   console.log(valueSearch)
// } 


// }
// var data = JSON.stringify(companiesAtt);
// var fs = require('fs');
// fs.writeFile('companiesAtt.json', data, (err) => {
//   if (err) {
//       throw err;
//   }
//   console.log("JSON data is saved.");
// })
 }




   async connect() {
    this.browser = await puppeteer.launch({
      headless: false,
    userDataDir: "./profileData",
    defaultViewport: null,
    });
  }
  }