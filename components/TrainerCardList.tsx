import React from 'react'

const TrainerCardList = ({trainer}) => {
  return (
    <div key={trainer.trainerName} className='trainerCardList'>
      <p>{trainer.trainerCardList.map((horse) => "|" + horse + "|")}</p>
    </div>
  )
}

export default TrainerCardList
