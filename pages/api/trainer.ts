import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";
import TrainerResults from "../../components/TrainerResults";


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
  
    for (let index = 0; index < arr.length; index += nth) {
      result.push(arr[index]);
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

function checkTrainName({trainerName}) {
    return trainerName !== 'No Trainer'
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

    // const testTD : HTMLCollectionOf<Element> 
    // = dom.window.document.querySelectorAll(".stable tr td");

    const trainers = Array.from(trainersTable, (trainer) => {
        // console.log(trainer.innerHTML)
        const trainerText = removeConsecutiveBlanks(trainer.innerHTML);
        const trainerInfoArr = trainerText.split("<td>");
        let trainerName = 'No Trainer';
        let trainerWin = 'No Trainer';
        let trainerHistory = [];
        let log = ''

        if (trainerInfoArr[5] !== undefined) {
            const firstIndex = trainerInfoArr[5].indexOf(">")
            const nextIndex = trainerInfoArr[5].indexOf("<", firstIndex + 1)
            trainerName = trainerInfoArr[5].substring(firstIndex + 1, nextIndex);
            if (trainerInfoArr[1] !== undefined) {
                const nextIndex = trainerInfoArr[1].indexOf("<")
                trainerWin = trainerInfoArr[1].substring(0, nextIndex);
            }
        }
        return { //init the trainer data
            trainerName,
            trainerWin,
            trainerHistory,
            log,
        };
    });
    //fitler the trainer and fill-in trainer details
    const trainersResult = trainers.filter(checkTrainName);
    for (var t in trainersResult) {
        trainersResult[t].trainerHistory = [1, 2, 3];
    }

    return trainersResult
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

        //do one by one
        const raceAllDatesResultArray = [];
        raceAllDatesResultArray[0] = getRaceDatesResult(await getDatafromURL(raceDatesURL[0]));
        raceAllDatesResultArray[1] = getRaceDatesResult(await getDatafromURL(raceDatesURL[1]));
        raceAllDatesResultArray[2] = getRaceDatesResult(await getDatafromURL(raceDatesURL[2]));
        raceAllDatesResultArray[3] = getRaceDatesResult(await getDatafromURL(raceDatesURL[3]));
        raceAllDatesResultArray[4] = getRaceDatesResult(await getDatafromURL(raceDatesURL[4]));
        // const raceDatesResult = await getDatafromURL(raceDatesURL[0]);
        // const raceDatesResultArray = getRaceDatesResult(raceDatesResult);
        // raceAllDatesResultArray[0] = raceDatesResultArray;
        
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
          //for testing, log the result
          trainersResult.map((trainer) => {
            trainer.log = "||"
            for (const raceDatesResultArray of raceAllDatesResultArray) {
                (raceDatesResultArray).map((trainerShortName) => {
                    trainer.log = trainer.log + trainerShortName
                    trainer.log = "||"
                })
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
