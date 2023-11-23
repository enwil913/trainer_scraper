import React from 'react'

const Header = ({title, version}) => {
    return (
        <header className='header'>
            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <h1>{title}</h1>
                <h3>{version}</h3>
            </div>
            <meta name="description" content="Trainers" />
            <link rel="icon" href="/favicon.ico" />
        </header>
  )
}

export default Header

