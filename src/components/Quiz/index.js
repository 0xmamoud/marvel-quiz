import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
import {QuizMarvel} from "../Questions"
import QuiOver from '../QuizOver';

class quiz extends Component {
  
  state = {
    levelNames: ["debutant", "confirme", "expert"],
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

  storedDataRef = React.createRef()

  loadQuestion = (quizz)=>{
   const fetchDataArray = QuizMarvel[0].quizz[quizz];
   if(fetchDataArray.length >= this.state.maxQuestion) {

      this.storedDataRef.current = fetchDataArray;
      const newArray = fetchDataArray.map(({answer, ...keepRest}) => keepRest)

      this.setState({
        storedQuestion: newArray
      })
   } else {
    console.log("Pas assez de questions")
   }
  }

  componentDidMount() { 
    this.loadQuestion(this.state.levelNames[this.state.quizLevel])
   }

   componentDidUpdate(prevProps, prevState) {
    if (this.state.storedQuestion !== prevState.storedQuestion) {
      this.setState({
        question: this.state.storedQuestion[this.state.idQuestion].question,
        options: this.state.storedQuestion[this.state.idQuestion].options
      });
    }

    if(this.state.idQuestion !== prevState.idQuestion){
      this.setState({
        question: this.state.storedQuestion[this.state.idQuestion].question,
        options: this.state.storedQuestion[this.state.idQuestion].options,
        userAnswer: null,
        btnDisabled: true
      });
    }

    if(this.props.userData.pseudo) {
      this.showWelcomeMsg(this.props.userData.pseudo)
    }
  }

  showWelcomeMsg = (pseudo) =>{
    if(!this.state.showWelcomeMsg) {
      this.setState({
        showWelcomeMsg: true
      })

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
        this.gameOver()
    } else {
      this.setState(prevState =>({
        idQuestion: prevState.idQuestion + 1
      }))
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

  getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) *100

  gameOver = () => {

    const gradepercent = this.getPercentage(this.state.maxQuestion, this.state.score)

    if(gradepercent >= 50) {
      this.setState({
        quizLevel: this.state.quizLevel + 1,
        percent: gradepercent,
        quizEnd: true
      })
    } else {
      this.setState({
        percent: gradepercent,
        quizEnd: true
      })
    }

    this.setState({
      quizEnd: true
    })
  }
  render() {

    const displayOptions = this.state.options.map((option, index)=>{
      return (
              <p className={`answerOptions ${this.state.userAnswer === option && "selected"}`}
                  key={index}
                  onClick={()=> {this.submitAnswer(option)}}
              >
                    {option}
              </p>
              )
     })

     return this.state.quizEnd ? 
        (
          <QuiOver 
            ref={this.storedDataRef}
            levelNames={this.state.levelNames}
            score={this.state.score}
            maxQuestion={this.state.maxQuestion}
            quizLevel={this.state.quizLevel}
            percent={this.state.percent}
          />
        )
      :
        (
          <div>
        <Levels />
        <ProgressBar 
          idQuestoin={this.state.idQuestion}
          maxQuestion={this.state.maxQuestion}
        />
        <h2>{this.state.question}</h2>
        {displayOptions}
        <button
          className='btnSubmit'
          disabled={this.state.btnDisabled}
          onClick={this.nextQuestion}
        >
          
          {this.state.idQuestion === this.state.maxQuestion - 1 ? "Terminer" : "Suivant"}
        </button>
        <ToastContainer />
      </div>
        )
  }
}

export default quiz