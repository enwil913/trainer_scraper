import React from 'react'
import Button from './Button'

const TrainerMenu = () => {
    const onClick = () => {
        console.log('Click')
    }

    return (
    <div className='trainer'>
        <Button color='green' text='排位表' onClick={onClick}/>      
    </div>
  )
}

export default TrainerMenu
