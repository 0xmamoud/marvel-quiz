import React from 'react'

const ProgressBar = ({idQuestoin}) => {
  return (
    <>
        <div className='percentage'>
            <div className='progressPercent'>Question: {1 + idQuestoin}/10</div>
            <div className='progressPercent'>Progression: {(1 + idQuestoin) * 10}%</div>
        </div>
        <div className='progressBar'>
            <div className='progressBarChange' style={{width: `${(1 + idQuestoin) * 10}%`}}></div>
        </div>
    </>
  )
}

export default ProgressBar