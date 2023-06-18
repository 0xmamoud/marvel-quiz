import React, {useEffect, useRef, useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
import { QuizMarvel } from '../Questions'
import QuizOver from '../QuizOver';

const Quiz = (props) => {

  const [levels, setLevels] = useState({
    levelNames: ["debutant", "confirme", "expert"],
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: "",
    options: []
  });

  const [idQuestoin, setIdQuestoin] = useState(0)

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizEnd, setQuizEnd] = useState(false)
  
  const storedDataRef = useRef(null)
  
  const loadQuestion = (question) => {
    const fetchedArrayQuiz = QuizMarvel[0].quizz[question]
    if(fetchedArrayQuiz.length >= levels.maxQuestions) {
      const newArray = fetchedArrayQuiz.map(({answer, ...keepRest})=> keepRest)
      storedDataRef.current = fetchedArrayQuiz
      setLevels({ ...levels,
        storedQuestions: newArray,
        question: newArray[idQuestoin],
        options: newArray[idQuestoin].options
      });
      
     
    } else {
        console.log("Pas assez de questions!!!");
    }
  }

  const showWelcomeMsg = (content)=> {
    toast.warn(`Bienvenue ${content} et bonne chance !`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false, 
      progress: undefined,
      theme: "colored",
      });
  }

  useEffect(() => {

    loadQuestion(levels.levelNames[levels.quizLevel])
    
  }, [levels.levelNames, levels.quizLevel, idQuestoin]);

  useEffect(() => {
    
    if(props.userData.pseudo){
      showWelcomeMsg(props.userData.pseudo)
    }
  }, [])
  
 


  const submitAnswer = (select)=>{
    setUserAnswer(select);
    setBtnDisabled(false)
  }

  const options =levels.options.map((option, index)=>{
      return (
          <p
            className={`answerOptions ${userAnswer === option && "selected"}`}
            key={index}
            onClick={ ()=>{submitAnswer(option)}}
          >
            {option}
          </p>)
  })

  const nextQuestion = ()=>{
    
    if(idQuestoin === levels.maxQuestions -1 ){
      // gameOver()
      setQuizEnd(true)
     setLevels({...levels, quizLevel: levels.quizLevel + 1})
     setIdQuestoin(0)
    } else {
      setIdQuestoin(idQuestoin + 1)
    }

    setBtnDisabled(true)

    const goodAnswer = storedDataRef.current[idQuestoin].answer;
    if(userAnswer === goodAnswer){
        setScore(score + 1);
        toast.success('Bravo ! +1', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
    } else if(userAnswer !== goodAnswer){
      toast.error('Raté ! 0', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }
    console.log(score);
  }

  // const gameOver = () =>{
  //   setQuizEnd(true);
  // }

  // const resetScore = setScore(0)
  return(
    quizEnd ?
    ( <QuizOver />)
    :
    <>
        <Levels levels = {levels}/>
        <ProgressBar idQuestoin = {idQuestoin}/>
        <h2>{levels.question.question}</h2>

        {options}

        <button
          className='btnSubmit'
          disabled={btnDisabled}
          onClick={nextQuestion}
        >
          Suivant
        </button>
        <ToastContainer />
      </>
    )
}

export default Quiz