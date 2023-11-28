import React from 'react'
import Button from './Button'


const TrainerMenu = ({toggleCardList}) => {
    return (
    <div className='trainerMenu'>
        <Button color='green' text='排位表' onClick={toggleCardList}/>      
        <Button color='blue' text='強馬房' onClick={toggleCardList}/>      
        <Button color='blue' text='大馬房' onClick={toggleCardList}/>      
        <Button color='blue' text='中馬房' onClick={toggleCardList}/>      
        <Button color='blue' text='新仔馬房' onClick={toggleCardList}/>      
    </div>
  )
}

export default TrainerMenu
