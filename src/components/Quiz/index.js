import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
import {QuizMarvel} from "../Questions"
import QuiOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa';

const initialState = {
    quizLevel: 0,
    maxQuestion: 10,
    storedQuestion: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: false,
    quizEnd: false,
    percent: null
  }

  const levelNames = ["debutant", "confirme", "expert"];


class quiz extends Component {

  constructor(props) {
    super(props)
  this.state = initialState
  this.storedDataRef = React.createRef()
  }
  
  loadQuestion = (quizz)=>{
   const fetchDataArray = QuizMarvel[0].quizz[quizz];
   if(fetchDataArray.length >= this.state.maxQuestion) {

      this.storedDataRef.current = fetchDataArray;
      const newArray = fetchDataArray.map(({answer, ...keepRest}) => keepRest)

      this.setState({ storedQuestion: newArray })
   }
  }

  componentDidMount() { this.loadQuestion(levelNames[this.state.quizLevel]) }

   componentDidUpdate(prevProps, prevState) {

    const 
    {
      maxQuestion,
      storedQuestion,
      idQuestion,
      score,
      quizEnd
    } = this.state
    
    if ((storedQuestion !== prevState.storedQuestion) && storedQuestion.length) {
      this.setState({
        question: storedQuestion[idQuestion].question,
        options: storedQuestion[idQuestion].options
      });
    }

    if((idQuestion !== prevState.idQuestion) && storedQuestion.length){
      this.setState({
        question: storedQuestion[idQuestion].question,
        options: storedQuestion[idQuestion].options,
        userAnswer: null,
        btnDisabled: true
      });
    }

    if(quizEnd !== prevState.quizEnd ) {
      const gradepercent = this.getPercentage(maxQuestion, score);
      this.gameOver(gradepercent)
    }

    if(this.props.userData.pseudo !== prevProps.userData.pseudo) {
      this.showToastMsg(this.props.userData.pseudo)
    }
  }

  showToastMsg = (pseudo) =>{
    if(!this.state.showWelcomeMsg) {
      this.setState({ showWelcomeMsg: true })

      toast.warn(`Bienvenue ${pseudo} et bonne chance!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "colored",
      });
    }
    
  }

  submitAnswer = (selectedAnswer) =>{
    this.setState({
      userAnswer: selectedAnswer,
      btnDisabled: false
    })
  }

  nextQuestion = ()=>{
    if(this.state.idQuestion === this.state.maxQuestion - 1) {

        this.setState({ quizEnd: true })

    } else {

      this.setState(prevState =>({ idQuestion: prevState.idQuestion + 1 }))

    }

    const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
      if(this.state.userAnswer === goodAnswer) {
        this.setState( prevState => ({
          score: prevState.score + 1
        }))

        toast.success('Bravo +1 !', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      } else {
        toast.error('Raté 0 !', {
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
  }

  getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

  gameOver = (percent) => {

    if(percent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent,

      })
    } else {

      this.setState({ percent })

    }

    
  }

  loadLevelQuestions = param => {
    this.setState({ ...initialState, quizLevel: param });

    this.loadQuestion(levelNames[param])
    
     
  }

  render() {
    const 
    {
      quizLevel,
      maxQuestion,
      question,
      options,
      idQuestion,
      btnDisabled,
      userAnswer,
      score,
      quizEnd,
      percent
    } = this.state

    const displayOptions = options.map((option, index)=>{
      
      return (
              <p className={`answerOptions ${userAnswer === option && "selected"}`}
                  key={index}
                  onClick={()=> {this.submitAnswer(option)}}
              >
                <FaChevronRight /> {option}
              </p>
              )
     })

     return quizEnd ? 
        (
          <QuiOver 
            ref={this.storedDataRef}
            levelNames={levelNames}
            score={score}
            maxQuestion={maxQuestion}
            quizLevel={quizLevel}
            percent={percent}
            loadLevelQuestions={this.loadLevelQuestions}
            
          />
        )
      :
        (
          <div>
        <Levels 
                   levelNames={levelNames}
                   quizLevel={quizLevel}
                />
        <ProgressBar 
          idQuestoin={idQuestion}
          maxQuestion={maxQuestion}
        />
        <h2>{question}</h2>
        {displayOptions}
        <button
          className='btnSubmit'
          disabled={btnDisabled}
          onClick={this.nextQuestion}
        >
          
          {idQuestion === maxQuestion - 1 ? "Terminer" : "Suivant"}
        </button>
        <ToastContainer />
      </div>
        )
  }
}

export default quiz