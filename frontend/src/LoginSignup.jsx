import React, { useState } from 'react';
import  './LoginSignup.css';

function Loginsignup()  {

  const [state,setState]=useState("Login");

  const [formData,setFormData]=useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler=(e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all the fields.");
      return false;
    }
    if (state === "Sign Up" && !formData.username) {
      alert("Please enter your name.");
      return false;
    }

    return true;
  };



  const login=async()=>{
    if (!validateForm()) return;
      console.log("Login Function Executed",formData);
      let responseData;
      await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then((response) => response.json()).then((data) =>responseData = data)
          if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("./DrawingBoard");
          }
          else{
            alert(responseData.error)
          }
  }

  const signup = async () => {
    if (!validateForm()) return;
    console.log("SignUp Function Executed", formData);
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) =>responseData = data)
        if (responseData.success) {
          localStorage.setItem('auth-token', responseData.token);
          window.location.replace("./DrawingBoard");
        }
        else{
          alert(responseData.error)
        }
  };
  
  return (
    <div className="login-bg">
    <div className="loginsignup">
      <div className={state === "Sign Up" ? "loginsignup-container signup1-container" : "loginsignup-container login1-container"}>
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ?
            <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p> :
            <p className="loginsignup-login">Create an account <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}
            <div className='Terms'>
            <p style={{ fontSize: '12px' }}>
              By {state} you are agreeing to our Terms and Conditions
            </p>
          </div>
        </div>
        
    </div>
  </div>
);
};

export default Loginsignup;