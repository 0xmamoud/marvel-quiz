import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setError(null);
        setSuccess(
          `consultez votre email ${email} pour changer le mot de passe`
        );
        setEmail("");
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      })
      .catch((error) => {
        setError(error);
        setEmail("");
      });
  };

  const btn =
    email === "" ? <button disabled>Envoyer</button> : <button>Envoyer</button>;

  return (
    <div className="signUpLoginBox">
      <div className="slContainer">
        <div className="formBoxLeftForget"></div>
        <div className="formBoxRight">
          <div className="formContent">
            {success && (
              <span
                style={{
                  border: "1px solid green",
                  background: "green",
                  color: "#ffffff",
                }}
              >
                {success}
              </span>
            )}

            {error && <span>{error.message}</span>}

            <h2>Mot de passe oublié ? </h2>
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
              {btn}
            </form>
          </div>
          <div className="linkContainer">
            <Link to="/login" className="simpleLink">
              Déjà inscrit ? Connectez-vous.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
