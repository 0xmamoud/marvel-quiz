import React, {useEffect, useState} from 'react'

const QuiOver = React.forwardRef((props, ref) => {

    const {
         levelNames,
         score,
         maxQuestion,
         quizLevel,
         percent
    } = props

    const [asked, setAsked] = useState([])
    
    useEffect(() => {
        setAsked(ref.current)
    }, [ref])

    const averageGrade = maxQuestion / 2;


    const decision = score >= averageGrade ? (
        <>
            <div className='stepsBtnContainer'>
                {
                    quizLevel < levelNames.length ?
                    (   
                        <>
                            <p className='successMsg'>Bravo, passez au niveau suivant !</p>
                            <button className='btnResult success'>Niveau suivant</button>
                        </>
                    )
                    :
                    (
                        <>
                            <p className='successMsg'>Bravo, vous êtes un expert !</p>
                            <button className='btnResult gameOver'>Niveau suivant</button>
                        </>
                    )
                }
            </div>
            <div className='percentage'>
                <div className='progressPercent'>Réussite: {percent}%</div>
                <div className='progressPercent'>Note: {score}/{maxQuestion}</div>
            </div>
        </>
    )
    :
    (
        <>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez échoué !</p>
            </div>

            <div className="percentage">
                <div className="progressPercent">Réussite: {percent} %</div>
                <div className="progressPercent">Note: {score}/{maxQuestion}</div>
            </div>
        </>
    )
    
    const quetionAnswer = score >= averageGrade ? (
        asked.map(question => {
        return (
            <tr key={question.id}>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>
                    <button className='btnInfo'>Infos</button>
                </td>
            </tr>
        )
    })
    )
    :
    (
         <tr>
            <td colSpan="3">
                <p style={{textAlign: "center", color: "red"}}>Pas de réponses ! </p>
            </td>
        </tr>
    )

    

  return (
    <>
       {decision}

        <hr />
        <p>Les réponses aux questions posées:</p>

        <table className="answers">
            <thead>
                <tr>
                    <th>Question</th>
                    <th>Réponses</th>
                    <th>Infos</th>
                </tr>
            </thead>
            <tbody>
                {quetionAnswer}
            </tbody>
        </table>
    </>
  )
})


export default React.memo(QuiOver)
            