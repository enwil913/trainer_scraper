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
  const [error, setError] = useState(null)


  //Set views
  const setTrainerView = () => {
    return (
      <p>Loading page!</p>
    )
   }

  
  const setErrorView = (err) => {
    return (
      <div>
        <p>Loading Error!</p>
        <p>{err}</p>
        <p>111</p>
      </div>
    )
  }


  useEffect(() => {
    try {
      const fetchTrainerData = async () => {
        const { data }  = await axios.get<ResultResponse>(
          `${window.location.href}/api/trainer`
        );
        setTrainerData(data.trainerData); 
      };
      fetchTrainerData();
      setError(null)
    }
    catch (err)
    {
      setError(err)
    }
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
        { error ?  setTrainerView() : setErrorView(error) }
      </div>
  );
};

export default TrainerResults;

