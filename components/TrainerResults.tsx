import axios from "axios";
import React, { useEffect, useState } from "react";
import TrainerMenu from "./TrainerMenu";
import Trainer from "./Trainer";
import TrainerCardList from "./TrainerCardList";


interface Result {
    trainerName: string;
    trainerShortName: string;
    trainerWin: string;
    trainerHistory: [];
    trainerConsecutiveLoss: number;
    log: string;
}

interface ResultResponse {
    trainerData: Result[];
};



const TrainerResults: React.FC = () => {
  const [trainerData, setTrainerData] = useState<Result[]>([]);
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

  const toggleCardList = () => {
    setShowCardList((showCardList) => !showCardList)
    console.log('Show/hide card list!')
  }
 

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const { data }  = await axios.get<ResultResponse>(
          `${window.location.href}/api/trainer`
        );
        setTrainerData(data.trainerData); 
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
        <TrainerMenu showComingRace={toggleCardList}/>
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

