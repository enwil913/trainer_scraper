import React from 'react'
import Button from './Button'


const TrainerMenu = ({showComingRace}) => {
    return (
    <div className='trainerMenu'>
        <Button color='green' text='排位表' onClick={showComingRace}/>      
        <Button color='blue' text='強馬房' onClick={showComingRace}/>      
        <Button color='blue' text='大馬房' onClick={showComingRace}/>      
        <Button color='blue' text='中馬房' onClick={showComingRace}/>      
        <Button color='blue' text='新仔馬房' onClick={showComingRace}/>      
    </div>
  )
}

export default TrainerMenu
