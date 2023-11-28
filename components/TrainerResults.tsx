import axios from "axios";
import React, { useEffect, useState } from "react";
import TrainerMenu from "./TrainerMenu";
import Trainer from "./Trainer";
import TrainerCardList from "./TrainerCardList";
import trainer from "../pages/api/trainer";


interface TrainerResult {
    trainerName: string;
    trainerShortName: string;
    trainerWin: string;
    trainerHistory: [];
    trainerConsecutiveLoss: number;
    trainerCardList?: number[];
    log: string;
}

interface ResultResponse {
    trainerData: TrainerResult[];
};



const TrainerResults: React.FC = () => {
  const [trainerData, setTrainerData] = useState<TrainerResult[]>([]);
  const [error, setError] = useState('No error')
  const [showCardList, setShowCardList] = useState(false);

  //const FUNCTION
  //Set views
  const setLoadingView = () => {
    return (
      //not show any text...
      <h2></h2>
    )
   }
  
  const setErrorView = () => {
    return (
      <div>
        <h2>Loading Error! Please reload the page!</h2>
      </div>
    )
  }

  //get card list data and show
  const toggleCardList = () => {
    setShowCardList((showCardList) => !showCardList)
    //not working....
    //
    //
    const tData = trainerData
    if (!showCardList) {
      tData.map((trainer) => {
        trainer.trainerCardList[0] = 0
        trainer.trainerCardList[0] = 1
        trainer.trainerCardList[0] = 2
      })
      console.log('Show card list!')
    }
    else {
      console.log('Hide card list!')
    }
  }

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const { data }  = await axios.get<ResultResponse>(
          `${window.location.href}/api/trainer`
        );
        setTrainerData(data.trainerData)
        setError('No error')
      }
      catch (err) {
        setError('Loading error')
      }
    };
    fetchTrainerData();
}, []);


  return (
      <div>
        <TrainerMenu toggleCardList={toggleCardList}/>
        {trainerData && trainerData.length > 0 ? (
          trainerData.map((trainer) => (
            <div key={trainer.trainerName}>
              <Trainer trainer={trainer}/>
              {showCardList && <TrainerCardList trainer={trainer}/>}
            </div>
              ))
        ) : (
          <div className="lds-hourglass"></div>
        )}
        { error === 'No error' ?  setLoadingView() : setErrorView() }
      </div>
  );
};

export default TrainerResults;

