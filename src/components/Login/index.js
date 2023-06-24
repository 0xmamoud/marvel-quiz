import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail("");
        setPassword("");
        navigate("/Welcome", { replace: true });
      })
      .catch((error) => {
        setEmail("");
        setPassword("");
        setError(error);
      });
  };

  const btn =
    email === "" || password === "" ? (
      <button disabled>Connexion</button>
    ) : (
      <button>Connexion</button>
    );

  const errorMsg = error !== "" && <span>{error.message}</span>;

  return (
    <div className="signUpLoginBox">
      <div className="slContainer">
        <div className="formBoxLeftLogin"></div>
        <div className="formBoxRight">
          <div className="formContent">
            {errorMsg}
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBox">
                <input
                  value={email}
                  type="email"
                  id="email"
                  autoComplete="off"
                  required
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Mot de passe</label>
              </div>
              {btn}
            </form>
            <div className="linkContainer">
              <Link to="/signup" className="simpleLink">
                Pas de compte ? inscrivez-vous.
              </Link>
              <br />
              <Link to="/forgetpassword" className="simpleLink">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
