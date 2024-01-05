import Header from "../components/Header";
import { Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignIn.css"
import { useState } from "react";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <Header />
            <div className="signin-form-bg">
                <div className="signin-form-container">
                    <h4 className="mb-5">Have an account?</h4>
                    <form className="signin-form" method="post">
                        <p>
                            <label className="email-label">Email:</label><br/>
                            <input type="email" name="email" id="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
                        </p>
                        <p>
                            <label className="password-label">Password:</label>
                            <input type={showPassword ? "text" : "password"} name="password" id="password"/>
                            {showPassword ? <FaEye className="eye-icon" onClick={handleShowPassword}/> : <FaEyeSlash className="eye-icon" onClick={handleShowPassword}/>}
                        </p>
                    </form>
                    <Button className="signin-submit-btn mb-4" onClick>Submit</Button>
                    <Form.Group className="tnc-signuplink mb-3">
                        <Form.Check
                        required
                        label="Agree to terms and conditions"
                        feedback="You must agree before submitting."
                        feedbackType="invalid"
                        />
                        <a href="/sign-up">Don't have an account?</a>
                    </Form.Group>
                    <a href="/reset-password">Forgot your password</a>
                </div>
            </div>
        </>
    );
};

export default SignIn;
