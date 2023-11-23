import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|")
    const consecutiveLoss = trainer.trainerConsecutiveLoss == -1 ? 0 : trainer.trainerConsecutiveLoss; 
    return (
        <div key={trainer.trainerName} className='trainer'>
            <h3>
                {trainer.trainerName}
                ({trainer.trainerShortName})
                Total Win: {trainer.trainerWin} 
                ConsecutiveLoss: {consecutiveLoss}  
            </h3>
            <p>{historyList}</p>  
            <p>{trainer.log}</p>
        </div>
    )
  }
  
  export default Trainer
  

