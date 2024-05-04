import { useState } from "react";

import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import Header from "../../components/Header/Header";
import AlertBox from "../../components/AlertBox/AlertBox";

import "./SignIn.css";

import axios from "axios";
import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

const SignIn = () => {
  const { decodedToken, isExpired } = useJwt(Cookies.get("jwt"));
  const [credentialsExist, setCredentialsExist] = useState(true);

  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, username: e.target.value });
    
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, password: e.target.value });
    
  };

  const validatePassword = () => {
    let errors = {};

    if (!formData.username) {
      errors.username = "Username is required";
    } 

    if (!formData.password) {
      errors.password = "Password is required";
    } 

    return errors;
  };

  const handleSignin = (e) => {
    setSignInLoading(true);

    e.preventDefault();
    var errors = {};
    setErrors({});
    setCredentialsExist(true);
    errors = validatePassword(formData.password);
    if (Object.keys(errors).length === 0) {
      axios.post(
        "https://54.169.240.7:8081/api/v1/login",
        {
          "username": formData.username,
          "email": "",
          "password": formData.password,
          "role": null
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
        .then(function (response) {
          Cookies.set("jwt", response.data.token);
          setCredentialsExist(true);
          
          window.location.href = "/dashboard";
        })
        .catch(function (error) {
          if (error.response) {
            // The server responded with a status code outside the 2xx range
            
            if (error.response.status == 401) {
              window.location.href = "/sign-in?expired=true";
            } else if (error.response.status == 409) {
              setCredentialsExist(false);
            } else {
              setSignInError(error.response.data + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
            }
          } else if (error.request) {
            // The request was made but no response was received
            
            setSignInError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
          } else {
            // Something happened in setting up the request that triggered an error
            
            setSignInError(error.message + ". Try again or contact TaskSwift at noreply.taskswift@gmail.com.");
          }
          setTimeout(() => {
            setSignInError(null);
          }, 6000);
        })
        .finally(() => setSignInLoading(false));
    }
    else {
      setErrors(errors);
    }
  }

  return (
    <>
      { decodedToken ? <Header loggedIn={true} username={decodedToken.sub} /> : <Header loggedIn={false} username={null} /> }
      <div className="Auth-form-container">
       
       <AlertBox errorMessage={ signInError } />

        <form noValidate className="Auth-form" onSubmit={handleSignin}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign in</h3>
            <div className="form-group username mt-3">
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Username"
                value={formData.username}
                onChange={handleUsernameChange}
              />
              <p className="error">{errors.username}</p>
            </div>
            <div className="form-group password mt-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mt-1 mb-1"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
              />
              <p className="error">{errors.password}</p>
              <div className="eye-icon-container">
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    color="white" 
                    label="Show password"
                    onChange={handleShowPassword}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary submit-btn">
                Submit
                {
                  signInLoading ? 
                  <span className="d-flex justify-content-center text-align-center">
                    <Spinner animation="grow" size="sm" />
                  </span>
                  :
                  null 
                }
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
                <a href="/sign-up">Don&apos;t have an account?</a>
            </p>
          </div>
          <p className={`error d-flex justify-content-center ${credentialsExist === true ? "d-none" : ""}`}>Username or password does not exist.</p>
        </form>
      </div>
    </>
  );
};

export default SignIn;
