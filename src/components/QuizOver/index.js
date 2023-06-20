import React, {useEffect, useState} from 'react';
import {GiTrophyCup} from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';
import axios from 'axios';

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
    const [openModal, setOpenModal] = useState(false)
    const [characterInfos, setCharacterInfos] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        setAsked(ref.current);
        if(localStorage.getItem("marvelStorageDate")) {
            const date = localStorage.getItem("marvelStorageDate");
            checkDataAge(date)
        }

    }, [ref])

    const checkDataAge = (date) => {
        let today = Date.now()

        const timeDifference = today - date;

        const daysDiffrence = timeDifference / (1000 * 3600 * 24);
        
        if( daysDiffrence >= 15 ) {
            localStorage.clear();
            localStorage.setItem("marvelStorageDate", Date.now())
        }
    }

    const averageGrade = maxQuestion / 2;

    if(score < averageGrade) {
        
        setTimeout(() => {
            loadLevelQuestions(quizLevel)
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

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const HASH = "38292ddbb4cae9ccfb5606db8a3f47ec";

    const  showModal = id => {
        setOpenModal(true);

        if(localStorage.getItem(id)) {
            
            setCharacterInfos(JSON.parse(localStorage.getItem(id)))
            setLoading(false)

        } else {

            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash${HASH}`)
            .then( response => {
                setCharacterInfos(response.data)
                setLoading(false)
            
                if(!localStorage.getItem("marvelStorageDate") ) {
                    localStorage.setItem("marvelStorageDate", Date.now())
                }
                localStorage.setItem(id, JSON.stringify(response.data))
            
            })
            .catch(err => console.log(err))
        }
        
    }

    const hideModal = () => {
        setOpenModal(false)
        setLoading(true)
    }
    
    const quetionAnswer = score >= averageGrade ? (
        asked.map(question => {
        return (
            <tr key={question.id}>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>
                    <button
                        className='btnInfo'
                        onClick={() => showModal(question.heroId)}
                    >
                        Infos
                    </button>
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

    const resultInModal = !loading ? 
    (
        <>
            <div className='modalHeader'>
                <h2>{characterInfos.data.results[0].name}</h2>
            </div>
            <div className='modalBody'>
                <div className='comicImage'>
                    <img src={`${characterInfos.data.results[0].thumbnail.path}.${characterInfos.data.results[0].thumbnail.extension}` } 
                        alt={characterInfos.data.results[0].name}
                    />
                    <p>{characterInfos.attributionText}</p>
                </div>
                <div className='comicDetails'>
                    <h3>Description</h3>
                    {
                        characterInfos.data.results[0].description ? 
                        <p>{characterInfos.data.results[0].description}</p>
                        :
                        <p>Description indisponible...</p>
                    }

                    <h3>PLUS D'INFOS</h3>
                    {
                        characterInfos.data.results[0].urls.map((info, index) => {
                            return <a
                                        href={info.url}
                                        key={index}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >{info.type}</a>
                        })
                    }
                </div>
            </div>
            <div className='modalFooter'>
                <button className='modalBtn' onClick={hideModal}>Fermer</button>
            </div>
        </>
    )
    :
    (
         <>
            <div className='modalHeader'>
                <h2> Réponse de Marvel</h2>
            </div>
            <div className='modalBody'>
                <Loader />
            </div>
        </>
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

        <Modal showModal={openModal} hideModal={hideModal}>
            {resultInModal}
        </Modal>
    </>
  )
})


export default React.memo(QuiOver)
            