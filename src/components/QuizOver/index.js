import React, {useEffect, useState} from 'react'
import {GiTrophyCup} from 'react-icons/gi'
import Loader from '../Loader'

const QuiOver = React.forwardRef((props, ref) => {

    const {
         levelNames,
         score,
         maxQuestion,
         quizLevel,
         percent,
         loadLevelQuestions
    } = props

    const [asked, setAsked] = useState([])
    
    useEffect(() => {
        setAsked(ref.current)
    }, [ref])

    const averageGrade = maxQuestion / 2;

    if(score < averageGrade) {
        setTimeout(() => {
            loadLevelQuestions(quizLevel)
            // loadLevelQuestions(0)
        }, 3000);
    }


    const decision = score >= averageGrade ? (
        <>
            <div className='stepsBtnContainer'>
                {
                    quizLevel < levelNames.length ?
                    (   
                        <>
                            <p className='successMsg'>Bravo, passez au niveau suivant !</p>

                            <button className='btnResult success'
                                onClick={() => loadLevelQuestions(quizLevel)}
                            >
                                Niveau suivant
                            </button>
                        </>
                    )
                    :
                    (
                        <>
                            <p className='successMsg'>
                                <GiTrophyCup
                                    size="50px"
                                /> Bravo, vous êtes un expert !
                            </p>

                            <button className='btnResult gameOver'
                                onClick={() => loadLevelQuestions(0)}
                            >
                                Acceuil
                            </button>
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
                <Loader
                    loadingMsg={"Pas de réponses ! "}
                    styling={{textAlign: "center", color: "red"}}
                />
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
            