import Header from "../../components/Header/Header";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useSearchParams } from "react-router-dom";

import "./SignUp.css";

import axios from "axios";
import Cookies from "js-cookie";
import { useJwt } from "react-jwt";

const SignUp = () => {
  const { decodedToken, isExpired } = useJwt(Cookies.get("jwt"));
  let [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [fetchData, setFetchData] = useState(null);
  const [signUpLoading, setSignUpLoading] = useState(null);
  const [signUpError, setSignUpError] = useState(null);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (e) => {
    setFormData({...formData, username: e.target.value});
  }

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleRepeatPasswordChange = (e) => {
    setFormData({ ...formData, repeatPassword: e.target.value });
  };

  const validatePassword = () => {
    let errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      errors.email = "Invalid Email Address!";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(formData.password)
    ) {
      errors.password =
        "Password needs to be 8 or more characters long, has at least on uppercase and a lowercase letter, and at least one digit ";
    }

    if (
      !formData.repeatPassword ||
      formData.repeatPassword != formData.password
    ) {
      errors.repeatPassword = "Passwords must match";
    }

    return errors;
  };

  const handleSignup = () => {
    var errors = {};
    setSignUpError(null);
    setFormErrors({});
    errors = validatePassword(formData.password);

    if (Object.keys(errors).length === 0) {
      setSignUpLoading(true);
      setFetchData(null);
      setSignUpError(null);

      let token = searchParams.get("token");

      if (token) {
        axios.post(
          `http://localhost:8081/api/v1/invite?token=${token}`, 
          {
            "username": formData.username,
            "email": formData.email,
            "password": formData.password,
            "role": "USER"
          },
          {
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
          })
          .then((response) => {
            setSignUpLoading(false);
            console.log(response);
            if (response.data) {
              setFetchData(response.data); 
              Cookies.set("jwt", response.data.token);
            
              sessionStorage.removeItem("username");
              sessionStorage.removeItem("role");
  
              sessionStorage.setItem("username", formData.username);
              sessionStorage.setItem("role", "USER");
  
              window.location.href = "/dashboard";
            }
          })
          .catch((error) => {
            setSignUpLoading(false);
            console.log(error);
            if (error.response) {
              setSignUpError(error.response.data);
            } else {
              setSignUpError("An error occurred. Please reload this page.")  
            }
          }
        );
      } else {
        axios.post(
          "http://localhost:8081/api/v1/register", 
          {
            "username": formData.username,
            "email": formData.email,
            "password": formData.password,
            "role": "USER"
          },
          {
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
          })
          .then((response) => {
            setSignUpLoading(false);
            console.log(response);
            if (response.data) {
              setFetchData(response.data); 
              Cookies.set("jwt", response.data.token);
            
              sessionStorage.removeItem("username");
              sessionStorage.removeItem("role");
  
              sessionStorage.setItem("username", formData.username);
              sessionStorage.setItem("role", "USER");
  
              window.location.href = "/dashboard";
            }
          })
          .catch((error) => {
            setSignUpLoading(false);
            console.log(error);
            if (error.response) {
              setSignUpError(error.response.data);
            } else {
              setSignUpError("An error occurred. Please reload this page.")  
            }
          }
        );
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <>
      { decodedToken ? <Header loggedIn={true} username={decodedToken.sub} /> : <Header loggedIn={false} username={null} /> }
      <div className="Auth-form-container">
        { signUpLoading ? 
          <span className="d-flex justify-content-center text-align-center">
            <Spinner animation="grow" size="sm" />
          </span> 
          :
          null
        }
        <form noValidate className="Auth-form" onSubmit={handleSignup}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign up</h3>
            <div className="form-group username mt-3">
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Username"
                value={formData.username}
                onChange={handleUsernameChange}
              />
              <p className="error">{formErrors.username}</p>
            </div>
            <div className="form-group email mt-3">
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email"
                value={formData.email}
                onChange={handleEmailChange}
              />
              <p className="error">{formErrors.email}</p>
            </div>
            <div className="form-group password mt-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mt-1 mb-1"
                placeholder="Password"
                value={formData.password}
                onChange={handlePasswordChange}
              />
              <p className="error">{formErrors.password}</p>
            </div>
            <div className="form-group password mt-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mt-1 mb-1"
                placeholder="Repeat password"
                value={formData.repeatPassword}
                onChange={handleRepeatPasswordChange}
              />
              <p className="error">{formErrors.repeatPassword}</p>
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
                  signUpLoading ? 
                  <span className="d-flex justify-content-center text-align-center">
                    <Spinner animation="grow" size="sm" />
                  </span> 
                  :
                  null
                }
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              <a href="/sign-in">Already have an account?</a>
            </p>
          </div>
          { signUpError ? <p className="error d-flex justify-content-center">{signUpError}</p> : null }
        </form>
      </div>
    </>
  );
};

export default SignUp;
