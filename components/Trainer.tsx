import React from 'react'


const Trainer = ({ trainer }) => {
    const historyList = trainer.trainerHistory.map((win: any) => "|" + win + "|")

    return (
        <div key={trainer.trainerName} className='trainer'>
            <h3>{trainer.trainerName}</h3>
            <p>{trainer.trainerWin}</p>  
            <p>{historyList}</p>  
      </div>
    )
  }
  
  export default Trainer
  

