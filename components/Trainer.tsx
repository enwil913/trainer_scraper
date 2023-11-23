import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|")
    const consecutiveLoss = trainer.trainerConsecutiveLoss == -1 ? 0 : trainer.trainerConsecutiveLoss; 
    return (
        <div key={trainer.trainerName} className='trainer'>
            <h3>
                {trainer.trainerName} ({trainer.trainerShortName}) 
                馬房 (冠): {trainer.trainerWin} 
                連輸: {consecutiveLoss}  
            </h3>
            <p>羸馬記錄(左至右): {historyList}</p>  
            <p>{trainer.log}</p>
        </div>
    )
  }
  
  export default Trainer
  

