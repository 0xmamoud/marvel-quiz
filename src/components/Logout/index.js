import React, {useState, useEffect} from 'react'
import {useNavigate } from 'react-router-dom'
import { auth } from '../Firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

const Logout = () => {

  const navigate = useNavigate()

  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(false)

  useEffect(() => {
      if(checked) {
        signOut(auth).then(() => {
          setTimeout(() => {
            navigate("/")
          }, 500);
        }).catch((error) => {
          // An error happened.
        });
      }
  }, [checked])
  
  const handleChange = (e) =>{
    setChecked(e.target.checked);

  }


  return (
    <div className='logoutContainer'>
      <label className='switch'>
        <input
          type='checkbox'
          checked={checked}
          onChange={handleChange}
        />
        <span className='slider round'></span>
      </label>

    </div>
  )
}

export default Logout