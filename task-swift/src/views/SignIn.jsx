import Header from "../components/Header";
import { Form } from "react-bootstrap";
import "./SignIn.css";
import { useState } from "react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, email: e.target.value });
    console.log(formData);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, password: e.target.value });
    console.log(formData);
  };

  const validatePassword = () => {
    let errors = {};

    if (!formData.email) {
        errors.email = "Email is required";
    } 
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
        errors.email = "Invalid Email Address!";
    }

    if (!formData.password) {
        errors.password = "Password is required";
    } 
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(formData.password)) {
        errors.password = "Password needs to be 8 or more characters long, has at least on uppercase and a lowercase letter, and at least one digit "
    }

    return errors;
  };

  const handleSignin = (e) => {
    var errors = {};
    errors = validatePassword(formData.password);
    if (!errors.email.length > 0 && errors.password.length > 0) {
        // TODO: If nothing is wrong, proceed with steps with email and password obtained!
    }
    else {
        setErrors(errors);
    }

    e.preventDefault();
  }

  return (
    <>
      <Header />
      <div className="Auth-form-container">
        <form noValidate className="Auth-form" onSubmit={handleSignin}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign in</h3>
            <div className="form-group email mt-3">
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email"
                value={formData.email}
                onChange={handleEmailChange}
              />
              <p className="error">{errors.email}</p>
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
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
                <a href="/sign-up">Don&apos;t have an account?</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignIn;
