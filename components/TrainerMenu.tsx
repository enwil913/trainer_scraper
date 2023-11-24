import React from 'react'
import Button from './Button'

const TrainerMenu = () => {
    const onClick = () => {
        console.log('Click')
    }

    return (
    <div className='trainerMenu'>
        <Button color='green' text='排位表' onClick={onClick}/>      
        <Button color='blue' text='強馬房' onClick={onClick}/>      
        <Button color='blue' text='大馬房' onClick={onClick}/>      
        <Button color='blue' text='中等馬房' onClick={onClick}/>      
        <Button color='blue' text='新仔馬房' onClick={onClick}/>      
    </div>
  )
}

export default TrainerMenu
