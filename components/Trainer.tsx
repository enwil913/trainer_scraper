import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|");
    const trainerShortName = "(" + trainer.trainerShortName + ")";

    return (
        <div key={trainer.trainerName} className='trainer'>
            <h3>
                {trainer.trainerName} {trainerShortName} 
                連輸: {trainer.trainerConsecutiveLoss}  
                總頭馬: {trainer.trainerWin} 
            </h3>
            <p>近十場頭馬(左至右): {historyList}</p>  
            <p>{trainer.log}</p>
        </div>
    )
  }
  
  export default Trainer
  

