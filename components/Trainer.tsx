import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|");
    const trainerShortName = "(" + trainer.trainerShortName + ")";

    return (
        <div key={trainer.trainerName} className='trainer'>
            <h4>
                <div>{trainer.trainerName} {trainerShortName}</div> 
                <div>馬評: <span style={(trainer.trainerConsecutiveLoss >= 3) ? {color: 'red'} : 
                (trainer.trainerConsecutiveLoss == 2) ? {color: "green"} : {}}>{trainer.log}</span></div>
                <div>總頭馬: {trainer.trainerWin}</div> 
            </h4>
            <p>
                <div>連輸: {trainer.trainerConsecutiveLoss}</div>  
                <div>近十場頭馬(左至右): {historyList}</div>
            </p>  
        </div>
    )
  }
  
  export default Trainer
  

