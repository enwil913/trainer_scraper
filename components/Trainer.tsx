import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|")
    const consecutiveLoss = trainer.trainerConsecutiveLoss == -1 ? 0 : trainer.trainerConsecutiveLoss; 
    return (
        <div key={trainer.trainerName} className='trainer'>
            <h3>{trainer.trainerName}({trainer.trainerShortName})</h3>
            <p>{trainer.trainerWin}</p>  
            <p>{consecutiveLoss}</p>  
            <p>{historyList}</p>  
            <p>{trainer.log}</p>
        </div>
    )
  }
  
  export default Trainer
  

