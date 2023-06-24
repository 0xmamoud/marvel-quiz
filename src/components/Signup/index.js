import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, user } from "../Firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { setDoc } from "firebase/firestore";

const Signup = () => {
  const data = {
    pseudo: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [loginData, setLoginData] = useState(data);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, pseudo } = loginData;
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        setDoc(user(authUser.user.uid), {
          pseudo,
          email,
        });
      })
      .then(() => {
        setLoginData({ ...data });
        navigate("/Welcome");
      })
      .catch((error) => {
        setError(error);
        setLoginData({ ...data });
      });
  };

  const { pseudo, email, password, confirmPassword } = loginData;

  // console.log(loginData)

  const btn =
    pseudo === "" ||
    email === "" ||
    password === "" ||
    password !== confirmPassword ? (
      <button disabled>Inscription</button>
    ) : (
      <button>Inscription</button>
    );

  // gestion erreurs
  const errorMsg = error !== "" && <span>{error.message}</span>;

  const navigate = useNavigate();

  return (
    <div className="signUpLoginBox">
      <div className="slContainer">
        <div className="formBoxLeftSignup"></div>
        <div className="formBoxRight">
          <div className="formContent">
            {errorMsg}
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBox">
                <input
                  value={pseudo}
                  type="text"
                  id="pseudo"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
                <label htmlFor="pseudo">Pseudo</label>
              </div>

              <div className="inputBox">
                <input
                  value={email}
                  type="email"
                  id="email"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="inputBox">
                <input
                  value={password}
                  type="password"
                  id="password"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
                <label htmlFor="password">Mot de passe</label>
              </div>

              <div className="inputBox">
                <input
                  value={confirmPassword}
                  type="password"
                  id="confirmPassword"
                  autoComplete="off"
                  required
                  onChange={handleChange}
                />
                <label htmlFor="confirmPassword">Confirmer mot de passe</label>
              </div>

              {btn}
            </form>
            <div className="linkContainer">
              <Link to="/login" className="simpleLink">
                Déjà inscrit ? Connectez-vous.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
