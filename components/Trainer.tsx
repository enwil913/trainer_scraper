import React from 'react'
// import TrainerCardList from './TrainerCardList';


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|");
    const trainerShortName = "(" + trainer.trainerShortName + ")";

    return (
        <div key={trainer.trainerName} className='trainer'>
            <h4>
                <div>{trainer.trainerName} {trainerShortName}</div> 
                <div>馬評: <span style={(trainer.trainerConsecutiveLoss >= 3) ? {color: 'red'} : 
                (trainer.trainerConsecutiveLoss == 2) ? {color: "royalblue"} : {}}>{trainer.log}</span></div>
            </h4>
            <p>
                <div>總頭馬: {trainer.trainerWin}</div> 
                <div>連輸: {trainer.trainerConsecutiveLoss}</div>  
                <div>近十場頭馬(左至右): {historyList}</div>
            </p>
        </div>
    )
  }
  
  export default Trainer
  

