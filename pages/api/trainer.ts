import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";

const getUrl = `https://racing.on.cc/racing/ifo/current/rjifob0001x0.html`;

function removeConsecutiveBlanks(str: string) {
  // replace two or more consecutive spaces with a single space
  str = str.replace(/\s{2,}/g, " ");
  // remove leading and trailing spaces
  str = str.trim();
  return str;
}

export default async function getTrainers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await axios.get(getUrl, {
        responseType: 'arraybuffer',
        transformResponse: [function (data) {
          const iconv = require('iconv-lite')
          return iconv.decode(Buffer.from(data), 'big5')
        }]
      });    
    const dom = new JSDOM(data);
    const trainersTable : HTMLCollectionOf<Element> 
        = dom.window.document.querySelectorAll(".stable tr");
    
    const trainers = Array.from(trainersTable, (trainer) => {
        // console.log(trainer.innerHTML)
        const trainerText = removeConsecutiveBlanks(trainer.innerHTML);
        const trainerInfoArr = trainerText.split("<td>");
        let trainerName = 'No Trainer';
        let trainerWin = 'No Trainer';

        if (trainerInfoArr[5] !== undefined) {
            trainerName = trainerInfoArr[5].substring(trainerInfoArr[5].indexOf(">") + 1, trainerInfoArr[5].lastIndexOf("<"));
            if (trainerInfoArr[1] !== undefined) {
                trainerWin = trainerInfoArr[1].substring(0, trainerInfoArr[1].lastIndexOf("<"));
                //to be implement...map trainerName to shortName
            }
        }
        return {
            trainerName,
            trainerWin,
        };
});

    res.status(200).json({trainerData: trainers});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching trainers");
  }
}
