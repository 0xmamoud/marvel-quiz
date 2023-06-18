import React from 'react'

const Levels = ({levels}) => {
  return (
    <div className='levelsContainer'>
        <h2 className='headingLevels'>{levels.levelNames[levels.quizLevel].toUpperCase()}</h2>
    </div>
  )
}

export default Levels