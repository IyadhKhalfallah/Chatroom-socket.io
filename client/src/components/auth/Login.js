import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext';
import { Redirect } from 'react-router-dom';
const Login = () => {
    const { user, setUser } = useContext(UserContext);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const submitHandler = async e => {
        e.preventDefault();
        setEmailError('');
        setNameError('');
        setPasswordError('');
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.errors) {
                setEmailError(data.errors.email);
                setNameError(data.errors.name);
                setPasswordError(data.errors.password);

            }
            if (data.user) {
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
        }
    }
    if (user) {
        return <Redirect to="/" />
    }
    return (
         <form onSubmit={submitHandler}>
        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input id="email" type="email" className="validate"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
          />
          <div className="email error red-text">{emailError}</div>
        </div>
        <div className="mb-3">
          <label>Password</label>
            <input id="password" type="password" className="validate"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
          />
          <div className="password error red-text">{passwordError}</div>
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
        </div>
      </form>
    )
}

export default Login
