import axios from "axios";
import React, { useEffect, useState } from "react";
interface Result {
    trainerName: string;
    trainerWin: string;
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
    <main>
      <h1 className="title">Trainer Result</h1>
      <div className="container">
        {trainerData && trainerData.length > 0 ? (
          trainerData.map((trainer) => (
            <div key={trainer.trainerName} className='trainer'>
              <h3>{trainer.trainerName}</h3>
              <p>{trainer.trainerWin}</p>  
            </div>
              ))
        ) : (
          <div className="lds-hourglass"></div>
        )}
      </div>
    </main>
  );
};

export default TrainerResults;
