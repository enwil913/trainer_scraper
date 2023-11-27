import axios from "axios";
import React, { useEffect, useState } from "react";
import TrainerMenu from "./TrainerMenu";
import Trainer from "./Trainer";


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

const showComingRace = () => {
  console.log('Show coming race!')
}


const TrainerResults: React.FC = () => {
  const [trainerData, setTrainerData] = useState<Result[]>([]);
  const [error, setError] = useState('No error')


  //Set views
  const setLoadingView = () => {
    return (
      <h2>Loading...</h2>
    )
   }

  
  const setErrorView = () => {
    return (
      <div>
        <h2>Loading Error! Please reload the page!</h2>
      </div>
    )
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
        <TrainerMenu showComingRace={showComingRace}/>
        {trainerData && trainerData.length > 0 ? (
          trainerData.map((trainer) => (
              <Trainer key={trainer.trainerName} trainer={trainer}/>
            ))
        ) : (
          <div className="lds-hourglass"></div>
        )}
        { error === 'No error' ?  setLoadingView() : setErrorView() }
      </div>
  );
};

export default TrainerResults;

