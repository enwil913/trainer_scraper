import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|");
    const trainerShortName = "(" + trainer.trainerShortName + ")";

    return (
        <div key={trainer.trainerName} className='trainer'>
            <h4>
                <div>{trainer.trainerName} {trainerShortName}</div> 
                <div>連輸: {trainer.trainerConsecutiveLoss}</div>  
                <div>總頭馬: {trainer.trainerWin}</div> 
            </h4>
            <p>近十場頭馬(左至右): {historyList}</p>  
            <p>{trainer.log}</p>
        </div>
    )
  }
  
  export default Trainer
  

