import Header from "../components/Header";
import { useState } from "react";
import { Form } from "react-bootstrap";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
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

  const handleRepeatPasswordChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, repeatPassword: e.target.value });
    console.log(formData);
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

  const handleSignup = (e) => {
    e.preventDefault();
    var errors = {};
    errors = validatePassword(formData.password);
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      // TODO: If nothing is wrong, proceed with steps with email and password obtained!
    } else {
      setErrors(errors);
    }

  };

  return (
    <>
      <Header />
      <div className="Auth-form-container">
        <form noValidate className="Auth-form" onSubmit={handleSignup}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign up</h3>
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
            </div>
            <div className="form-group password mt-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mt-1 mb-1"
                placeholder="Repeat password"
                value={formData.repeatPassword}
                onChange={handleRepeatPasswordChange}
              />
              <p className="error">{errors.repeatPassword}</p>
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
              <a href="/sign-in">Already have an account?</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
