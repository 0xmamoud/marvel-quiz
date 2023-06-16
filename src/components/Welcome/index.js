import React, {useState, Fragment, useEffect} from 'react';
import Logout from '../Logout';
import Quiz from '../Quiz';
import { auth, user } from '../Firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import {useNavigate } from 'react-router-dom';

const Welcome = () => {

  const navigate = useNavigate();

  const [userSession, setUserSession] = useState(null);
  const [userData, setUserData] = useState({})
  
  useEffect(() => {
    
    onAuthStateChanged(auth, (user) => {
      user ? setUserSession(user): setTimeout(() => {
        navigate("/")
      }, 500);
    });

    if(!!userSession) {
      const docRef = user(userSession.uid)
      getDoc(docRef)
      .then(docSnap =>{
        if(docSnap.exists()) {
          const docData = docSnap.data();
          setUserData(docData)
        }
      })
      .catch(error => {
        console.log(error)
      })
      
    }
   
  }, [userSession, navigate])

  // console.log(userData)

  return ( userSession === null ? 
          <Fragment>
            <div className='loader'></div>
            <p>loading</p>
          </Fragment> :
          <div className='quiz-bg'>
            <div className='container'>
              <Logout />
              <Quiz userData={userData}/>
            </div>
          </div>
  )
}

export default Welcome