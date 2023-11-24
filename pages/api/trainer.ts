import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
// import TrainerResults from "../../components/TrainerResults";
import { TrainersList_Const } from "../../components/Constants";
import { TrainersSelfMsg_Const } from "../../components/Constants";
import { TrainersBetMsg_Const } from "../../components/Constants";


//for meta race date meta data
const localResultURL = "https://racing.on.cc/racing/rat/current/rjratg0001x0.html"
//for race card list
const cardListURL = "https://racing.on.cc/racing/ifo/current/rjifob0001x0.html"
//for traniner result
const localResultURLPrefix = "https://racing.on.cc/racing/rat/"
const localResultURLPostfix  = "/rjratg0001x0.html"   


async function getDatafromURL(url) {
    const page = await axios.get(url, {
        responseType: 'arraybuffer',
        transformResponse: [function (data) {
          const iconv = require('iconv-lite')
          return iconv.decode(Buffer.from(data), 'big5')
        }]
      });
    return page.data
}


function getEveryNth(arr, nth) {
    const result = [];
    const bDivisble =  ((arr.length % nth) == 0) 
    for (let index = 0; index < arr.length; index += nth) {
      bDivisble ? result.push(arr[index]) : result.push('XX');
    }
    return result;
  }

function removeConsecutiveBlanks(str: string) {
  // replace two or more consecutive spaces with a single space
  str = str.replace(/\s{2,}/g, " ");
  // remove leading and trailing spaces
  str = str.trim();
  return str;
}


//get data functions
function getDatesArray(data) {
    const dom = new JSDOM(data);
    const dateSelect : HTMLCollectionOf<Element> = dom.window.document.querySelectorAll('option');
    
    const dates = Array.from(dateSelect, (date) => {
      return date.textContent;
  });
  dates.shift();
  return dates
}

function getRaceDatesResult(data) {
    const dom = new JSDOM(data);
    const raceResultTable : HTMLCollectionOf<Element> = dom.window.document.querySelectorAll('.stableB a[href*="stable_view.cgi"]');
    const raceResultArray = Array.from(raceResultTable, (date) => {
        return date.textContent;
    });
    const raceTrainersArray = getEveryNth(raceResultArray, 4);    
    //for testing at this moment
    return raceTrainersArray
}

function getTrainersList(data) {
    const dom = new JSDOM(data);
    const trainersTable : HTMLCollectionOf<Element> 
        = dom.window.document.querySelectorAll(".stable tr");

    const trainers = Array.from(trainersTable, (trainer) => {
        let trainerName = 'No Trainer'; //use by "checkTrainerName" to filter out the trainer
        let trainerShortName = '';
        let trainerWin = '';
        let trainerHistory = [];
        let trainerConsecutiveLoss = 0
        let log = ''

        const trainerText = removeConsecutiveBlanks(trainer.innerHTML);
        const trainerInfoArr = trainerText.split("<td>");

        if (trainerInfoArr[5] !== undefined) {
            const firstIndex = trainerInfoArr[5].indexOf(">")
            const nextIndex = trainerInfoArr[5].indexOf("<", firstIndex + 1)
            trainerName = trainerInfoArr[5].substring(firstIndex + 1, nextIndex);
            if (trainerInfoArr[1] !== undefined) {
                const nextIndex = trainerInfoArr[1].indexOf("<")
                trainerWin = trainerInfoArr[1].substring(0, nextIndex);
            }
        }
        return { //init the trainer data, should match with "let" at the beginning of this function
            trainerName,
            trainerShortName,
            trainerWin,
            trainerHistory,
            trainerConsecutiveLoss,
            log,
        };
    });
    //fitler the trainer and fill-in trainer details (i.e. trainerShortName)
    const trainersResult = trainers.filter(checkTrainerName);
    for (var t in trainersResult) {
        TrainersList_Const.map((cTrainer) => {
            trainersResult[t].trainerShortName = (cTrainer.name == trainersResult[t].trainerName) ? cTrainer.shortName : trainersResult[t].trainerShortName; 
        })
        // trainersResult[t].trainerHistory = [1, 2, 3];
    }

    return trainersResult
}

//for getTrainerList
function checkTrainerName({trainerName}) {
    return trainerName !== 'No Trainer'
}


export default async function getTrainers(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {
        //get race dates
        const raceDate = await axios.get(localResultURL, {
            responseType: 'arraybuffer',
            transformResponse: [function (data) {
              const iconv = require('iconv-lite')
              return iconv.decode(Buffer.from(data), 'big5')
            }]
          });
          const datesArray = getDatesArray(raceDate.data);
          const raceDatesURL = datesArray.map((date)=> {
            const dateSplitted = date.split('/')
            return localResultURLPrefix + dateSplitted[2] + dateSplitted[1] + dateSplitted[0] + localResultURLPostfix
          });
        //get 10 races results          
        //do one by one
        const raceAllDatesResultArray = [];
        for (let i=0; i<=9; i++) {
            raceAllDatesResultArray[i] = getRaceDatesResult(await getDatafromURL(raceDatesURL[i]));
        }
        
        //NOT working...review multiple axios "async await" 
        // //get race date result 
        // const raceAllDatesResultsArray = raceDatesURL.map(getDatafromURL)
        // await Promise.all(raceAllDatesResultsArray);
        //end NOT working 

        //get trainer card list
        const cardList = await axios.get(cardListURL, {
            responseType: 'arraybuffer',
            transformResponse: [function (data) {
              const iconv = require('iconv-lite')
              return iconv.decode(Buffer.from(data), 'big5')
            }]
          });    
        const trainersResult = getTrainersList(cardList.data);
        //Set race day win result  
        trainersResult.map((trainer) => {
            let dayCount = 0;
            for (const raceDatesResultArray of raceAllDatesResultArray) {
                trainer.trainerHistory[dayCount] = 0;
                (raceDatesResultArray).map((trainerShortName) => {
                    trainer.trainerHistory[dayCount] = (trainerShortName == trainer.trainerShortName) ? trainer.trainerHistory[dayCount] + 1 : trainer.trainerHistory[dayCount]
                    // trainer.log = trainer.log + trainerShortName
                });
                // trainer.log = trainer.log + "||"
                dayCount = dayCount + 1;
            }
            trainer.trainerConsecutiveLoss = trainer.trainerHistory.findIndex((element) => element > 0)
            trainer.trainerConsecutiveLoss = (trainer.trainerConsecutiveLoss == -1) ? dayCount : trainer.trainerConsecutiveLoss; 
        })
        //sort the trainer list
        trainersResult.sort((a, b) => {
            return (a.trainerConsecutiveLoss < b.trainerConsecutiveLoss ? 1 : 
                a.trainerConsecutiveLoss > b.trainerConsecutiveLoss ? -1 : 0)
        });
   
        //find trainer message
        trainersResult.map((trainer) => {
            trainer.log = TrainersSelfMsg_Const[trainer.trainerShortName];
            if (trainer.log !== "弱馬房, 放棄"){
                trainer.log = trainer.log + "..." + TrainersBetMsg_Const[trainer.trainerShortName];
            } 
        })

        res.status(200).json({trainerData: trainersResult});

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching trainers");
    }
}


// function getRaceDatesResult(data) {
//     const dom = new JSDOM(data);
//     const raceResultTable : HTMLCollectionOf<Element> = dom.window.document.querySelectorAll("#maintable");
//     const raceResultArray = Array.from(raceResultTable, (raceResult) => {
//         return raceResult.innerHTML
//     });
//     const fromContentHTML = raceResultArray[0];
//     // const divHtmlContents = fromContentHTML.split("賽事日期")

//     // console.log(divHtmlContents.length);

//     // if (divHtmlContents.length <= 1) {
//     //     console.log("Error: No Last Win Result found")
//     //     return raceResultArray
//     // }
//     // const horseResultHtml = divHtmlContents[1]
//     // console.log(horseResultHtml);
//     const divHorseRaceHtml = fromContentHTML.split('<td colspan=\"3\" align=\"left\">第');

//     if (divHorseRaceHtml.length <= 1) {
//         console.log("Error: No Race Result found")
//         return raceResultArray
//     }
//     //for testing at this moment
//     return divHorseRaceHtml.slice(2, 10)
      
// }
