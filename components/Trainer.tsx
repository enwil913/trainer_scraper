import React from 'react'


const Trainer = ({ trainer }) => {
    return (
        <div key={trainer.trainerName} className='trainer'>
            <h3>{trainer.trainerName}</h3>
            <p>{trainer.trainerWin}</p>  
            <p>Win History</p>  
      </div>
    )
  }
  
  export default Trainer
  

