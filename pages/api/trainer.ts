import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";


//for meta race date meta data
const localResultURL = "https://racing.on.cc/racing/rat/current/rjratg0001x0.html"
//for race card list
const cardListURL = "https://racing.on.cc/racing/ifo/current/rjifob0001x0.html"


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

function getTrainersList(data) {
    try {
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
            };
        });
        //fitler the trainer and fill-in trainer details
        const trainersResult = trainers.filter(checkTrainName);
        for (var t in trainersResult) {
            trainersResult[t].trainerHistory = [1, 2, 3];
        }
    
        return trainersResult
    } catch (error) {
        console.error(error);
    }
}

function getDatesArray(data) {
    const dom = new JSDOM(data);
    const dateSelect : HTMLCollectionOf<Element> = dom.window.document.querySelectorAll('select');
    
    const dates = Array.from(dateSelect, (date) => {
      return date.textContent;
  });
  dates.map((date)=> {
    console.log(date)
  });
  dates.shift();
  dates.map((date)=> {
    console.log(date)
  });
  return dates
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
          datesArray.map((date)=> {
            console.log(date)
          });

        //get card list
        const cardList = await axios.get(cardListURL, {
            responseType: 'arraybuffer',
            transformResponse: [function (data) {
              const iconv = require('iconv-lite')
              return iconv.decode(Buffer.from(data), 'big5')
            }]
          });    
          const trainersResult = getTrainersList(cardList.data);


        res.status(200).json({trainerData: trainersResult});

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching trainers");
    }
}
