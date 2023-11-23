import axios from "axios";
import React, { useEffect, useState } from "react";
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
}

const TrainerResults: React.FC = () => {
  const [trainerData, setTrainerData] = useState<Result[]>([]);

  useEffect(() => {
    const fetchTrainerData = async () => {
      const { data }  = await axios.get<ResultResponse>(
        `${window.location.href}/api/trainer`
      );
      setTrainerData(data.trainerData); 
    };
    fetchTrainerData();
  }, []);

  return (
      <div>
        {trainerData && trainerData.length > 0 ? (
          trainerData.map((trainer) => (
            <Trainer key={trainer.trainerName} trainer={trainer}/>
            ))
        ) : (
          <div className="lds-hourglass"></div>
        )}
      </div>
  );
};

export default TrainerResults;

